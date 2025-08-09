import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Chat, { IChat } from '../models/Chat';
import Message, { IMessage } from '../models/Message';
import ChatParticipant, { IChatParticipant } from '../models/ChatParticipant';
import Employee, { IEmployee } from '../models/Employee';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ChatController {
  // ========== CHAT ROOMS ==========

  // Get all chat rooms for user's department
  static async getDepartmentChats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { page = 1, limit = 20, search } = req.query;

      // Build query for user's department
      const query: any = {
        department: user.department,
        isActive: true,
        participants: user.id
      };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);

      // Execute query with pagination
      const [chats, totalCount] = await Promise.all([
        Chat.find(query)
          .sort({ lastActivity: -1 })
          .skip(skip)
          .limit(Number(limit))
          .populate('participants', 'name email avatar department')
          .lean(),
        Chat.countDocuments(query)
      ]);

      // Get unread message counts for each chat
      const chatsWithUnreadCount = await Promise.all(
        chats.map(async (chat) => {
          const participant = await ChatParticipant.findOne({
            chatId: chat._id,
            userId: user.id
          });

          const unreadCount = await Message.countDocuments({
            chatId: chat._id,
            createdAt: { $gt: participant?.lastMessageReadAt || new Date(0) },
            senderId: { $ne: user.id },
            isDeleted: false
          });

          return {
            ...chat,
            id: chat._id.toString(),
            unreadCount
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          chats: chatsWithUnreadCount,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalCount / Number(limit)),
            totalCount,
            hasNext: skip + Number(limit) < totalCount,
            hasPrevious: Number(page) > 1
          }
        },
        message: 'Department chats retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching department chats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching chats',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get or create department chat room
  static async getOrCreateDepartmentChat(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      // Check if department chat already exists
      let chat = await Chat.findOne({
        department: user.department,
        type: 'department',
        isActive: true
      }).populate('participants', 'name email avatar department');

      if (!chat) {
        // Get all employees in the same department
        const departmentEmployees = await (Employee as any).find({
          department: user.department,
          status: 'active'
        }).select('_id name email avatar department').lean();

        // Create new department chat
        chat = new Chat({
          department: user.department,
          name: `${user.department} Department Chat`,
          description: `General chat room for ${user.department} department members`,
          type: 'department',
          participants: departmentEmployees.map((emp: any) => emp._id),
          createdBy: user.id,
          lastActivity: new Date()
        });

        const savedChat = await chat.save();

        // Create chat participants for all department members
        const participants = departmentEmployees.map((emp: any) => ({
          chatId: savedChat._id,
          userId: emp._id,
          userName: emp.name,
          userEmail: emp.email,
          department: emp.department,
          role: emp._id.toString() === user.id ? 'admin' : 'member'
        }));

        await ChatParticipant.insertMany(participants);

        // Populate the chat with participant details
        chat = await Chat.findById(savedChat._id)
          .populate('participants', 'name email avatar department');
      } else {
        // Ensure current user is a participant
        const isParticipant = await ChatParticipant.findOne({
          chatId: chat._id,
          userId: user.id,
          isActive: true
        });

        if (!isParticipant) {
          // Add user as participant
          await ChatParticipant.create({
            chatId: chat._id,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            department: user.department,
            role: 'member'
          });

          // Add user to chat participants
          await Chat.findByIdAndUpdate(chat._id, {
            $addToSet: { participants: user.id }
          });
        }
      }

      res.status(200).json({
        success: true,
        data: chat,
        message: 'Department chat retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error getting/creating department chat:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while getting chat',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // ========== MESSAGES ==========

  // Get messages for a chat room
  static async getChatMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { chatId } = req.params;
      const { page = 1, limit = 50, before } = req.query;

      // Verify user has access to this chat
      const participant = await ChatParticipant.findOne({
        chatId,
        userId: user.id,
        isActive: true
      });

      if (!participant) {
        res.status(403).json({
          success: false,
          message: 'Access denied - You are not a participant in this chat'
        });
        return;
      }

      // Build query
      const query: any = {
        chatId,
        isDeleted: false
      };

      if (before) {
        query.createdAt = { $lt: new Date(before as string) };
      }

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);

      // Execute query with pagination (newest first)
      const [messages, totalCount] = await Promise.all([
        Message.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .populate('replyTo', 'content senderName createdAt')
          .lean(),
        Message.countDocuments(query)
      ]);

      // Reverse to show oldest first in the response
      const orderedMessages = messages.reverse().map(message => ({
        ...message,
        id: message._id.toString(),
        isOwnMessage: message.senderId.toString() === user.id
      }));

      res.status(200).json({
        success: true,
        data: {
          messages: orderedMessages,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalCount / Number(limit)),
            totalCount,
            hasNext: skip + Number(limit) < totalCount,
            hasPrevious: Number(page) > 1
          }
        },
        message: 'Messages retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching messages',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Send a new message
  static async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { chatId } = req.params;
      const { content, messageType = 'text', replyTo, mentions } = req.body;

      // Verify user has access to this chat
      const participant = await ChatParticipant.findOne({
        chatId,
        userId: user.id,
        isActive: true
      });

      if (!participant) {
        res.status(403).json({
          success: false,
          message: 'Access denied - You are not a participant in this chat'
        });
        return;
      }

      // Create new message
      const message = new Message({
        chatId,
        senderId: user.id,
        senderName: user.name,
        senderDepartment: user.department,
        content: content.trim(),
        messageType,
        replyTo: replyTo || undefined,
        mentions: mentions || [],
        readBy: [{
          userId: user.id,
          userName: user.name,
          readAt: new Date()
        }]
      });

      const savedMessage = await message.save();

      // Update chat's last message and activity
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: {
          messageId: savedMessage._id,
          content: content.trim(),
          senderId: user.id,
          senderName: user.name,
          sentAt: savedMessage.createdAt,
          messageType
        },
        lastActivity: new Date()
      });

      // Populate reply information if exists
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('replyTo', 'content senderName createdAt')
        .lean();

      res.status(201).json({
        success: true,
        data: {
          ...populatedMessage,
          id: populatedMessage!._id.toString(),
          isOwnMessage: true
        },
        message: 'Message sent successfully'
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while sending message',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Edit a message
  static async editMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { messageId } = req.params;
      const { content } = req.body;

      // Find message and verify ownership
      const message = await Message.findOne({
        _id: messageId,
        senderId: user.id,
        isDeleted: false
      });

      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message not found or you do not have permission to edit it'
        });
        return;
      }

      // Update message content
      message.content = content.trim();
      message.editedAt = new Date();
      message.isEdited = true;

      const updatedMessage = await message.save();

      res.status(200).json({
        success: true,
        data: {
          ...updatedMessage.toJSON(),
          isOwnMessage: true
        },
        message: 'Message updated successfully'
      });
    } catch (error: any) {
      console.error('Error editing message:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while editing message',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Delete a message
  static async deleteMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { messageId } = req.params;

      // Find message and verify ownership
      const message = await Message.findOne({
        _id: messageId,
        senderId: user.id,
        isDeleted: false
      });

      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message not found or you do not have permission to delete it'
        });
        return;
      }

      // Soft delete message
      message.isDeleted = true;
      message.deletedAt = new Date();
      message.content = 'This message has been deleted';

      await message.save();

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
        data: {
          id: messageId,
          isDeleted: true
        }
      });
    } catch (error: any) {
      console.error('Error deleting message:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting message',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { chatId } = req.params;
      const { lastMessageId } = req.body;

      // Verify user has access to this chat
      const participant = await ChatParticipant.findOne({
        chatId,
        userId: user.id,
        isActive: true
      });

      if (!participant) {
        res.status(403).json({
          success: false,
          message: 'Access denied - You are not a participant in this chat'
        });
        return;
      }

      // Update participant's last read message
      await ChatParticipant.findByIdAndUpdate(participant._id, {
        lastMessageReadAt: new Date(),
        lastSeenAt: new Date()
      });

      // Mark messages as read for this user
      const lastMessage = lastMessageId ? await Message.findById(lastMessageId) : null;
      const readUntil = lastMessage ? lastMessage.createdAt : new Date();

      await Message.updateMany(
        {
          chatId,
          createdAt: { $lte: readUntil },
          senderId: { $ne: user.id },
          'readBy.userId': { $ne: user.id }
        },
        {
          $push: {
            readBy: {
              userId: user.id,
              userName: user.name,
              readAt: new Date()
            }
          }
        }
      );

      res.status(200).json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while marking messages as read',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // ========== CHAT PARTICIPANTS ==========

  // Get chat participants
  static async getChatParticipants(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const { chatId } = req.params;

      // Verify user has access to this chat
      const userParticipant = await ChatParticipant.findOne({
        chatId,
        userId: user.id,
        isActive: true
      });

      if (!userParticipant) {
        res.status(403).json({
          success: false,
          message: 'Access denied - You are not a participant in this chat'
        });
        return;
      }

      // Get all active participants
      const participants = await ChatParticipant.find({
        chatId,
        isActive: true
      })
      .populate('userId', 'name email avatar department')
      .sort({ role: 1, userName: 1 })
      .lean();

      const formattedParticipants = participants.map(participant => ({
        ...participant,
        id: participant._id.toString(),
        user: participant.userId
      }));

      res.status(200).json({
        success: true,
        data: {
          participants: formattedParticipants,
          totalCount: participants.length
        },
        message: 'Chat participants retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching chat participants:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching participants',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Update user's online status
  static async updateOnlineStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      // Update last seen for all user's active chat participations
      await ChatParticipant.updateMany(
        {
          userId: user.id,
          isActive: true
        },
        {
          lastSeenAt: new Date()
        }
      );

      res.status(200).json({
        success: true,
        message: 'Online status updated'
      });
    } catch (error: any) {
      console.error('Error updating online status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating status',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
