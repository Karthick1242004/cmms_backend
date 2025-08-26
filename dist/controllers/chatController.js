"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const express_validator_1 = require("express-validator");
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const ChatParticipant_1 = __importDefault(require("../models/ChatParticipant"));
const Employee_1 = __importDefault(require("../models/Employee"));
class ChatController {
    static async getDepartmentChats(req, res) {
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
            const query = {
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
            const skip = (Number(page) - 1) * Number(limit);
            const [chats, totalCount] = await Promise.all([
                Chat_1.default.find(query)
                    .sort({ lastActivity: -1 })
                    .skip(skip)
                    .limit(Number(limit))
                    .populate('participants', 'name email avatar department')
                    .lean(),
                Chat_1.default.countDocuments(query)
            ]);
            const chatsWithUnreadCount = await Promise.all(chats.map(async (chat) => {
                const participant = await ChatParticipant_1.default.findOne({
                    chatId: chat._id,
                    userId: user.id
                });
                const unreadCount = await Message_1.default.countDocuments({
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
            }));
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
        }
        catch (error) {
            console.error('Error fetching department chats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching chats',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getOrCreateDepartmentChat(req, res) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
                return;
            }
            let chat = await Chat_1.default.findOne({
                department: user.department,
                type: 'department',
                isActive: true
            }).populate('participants', 'name email avatar department');
            if (!chat) {
                const departmentEmployees = await Employee_1.default.find({
                    department: user.department,
                    status: 'active'
                }).select('_id name email avatar department').lean();
                chat = new Chat_1.default({
                    department: user.department,
                    name: `${user.department} Department Chat`,
                    description: `General chat room for ${user.department} department members`,
                    type: 'department',
                    participants: departmentEmployees.map((emp) => emp._id),
                    createdBy: user.id,
                    lastActivity: new Date()
                });
                const savedChat = await chat.save();
                const participants = departmentEmployees.map((emp) => ({
                    chatId: savedChat._id,
                    userId: emp._id,
                    userName: emp.name,
                    userEmail: emp.email,
                    department: emp.department,
                    role: emp._id.toString() === user.id ? 'admin' : 'member'
                }));
                await ChatParticipant_1.default.insertMany(participants);
                chat = await Chat_1.default.findById(savedChat._id)
                    .populate('participants', 'name email avatar department');
            }
            else {
                const isParticipant = await ChatParticipant_1.default.findOne({
                    chatId: chat._id,
                    userId: user.id,
                    isActive: true
                });
                if (!isParticipant) {
                    await ChatParticipant_1.default.create({
                        chatId: chat._id,
                        userId: user.id,
                        userName: user.name,
                        userEmail: user.email,
                        department: user.department,
                        role: 'member'
                    });
                    await Chat_1.default.findByIdAndUpdate(chat._id, {
                        $addToSet: { participants: user.id }
                    });
                }
            }
            res.status(200).json({
                success: true,
                data: chat,
                message: 'Department chat retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error getting/creating department chat:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while getting chat',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getChatMessages(req, res) {
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
            const participant = await ChatParticipant_1.default.findOne({
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
            const query = {
                chatId,
                isDeleted: false
            };
            if (before) {
                query.createdAt = { $lt: new Date(before) };
            }
            const skip = (Number(page) - 1) * Number(limit);
            const [messages, totalCount] = await Promise.all([
                Message_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit))
                    .populate('replyTo', 'content senderName createdAt')
                    .lean(),
                Message_1.default.countDocuments(query)
            ]);
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
        }
        catch (error) {
            console.error('Error fetching chat messages:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching messages',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async sendMessage(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
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
            const participant = await ChatParticipant_1.default.findOne({
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
            const message = new Message_1.default({
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
            await Chat_1.default.findByIdAndUpdate(chatId, {
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
            const populatedMessage = await Message_1.default.findById(savedMessage._id)
                .populate('replyTo', 'content senderName createdAt')
                .lean();
            res.status(201).json({
                success: true,
                data: {
                    ...populatedMessage,
                    id: populatedMessage._id.toString(),
                    isOwnMessage: true
                },
                message: 'Message sent successfully'
            });
        }
        catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while sending message',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async editMessage(req, res) {
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
            const message = await Message_1.default.findOne({
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
        }
        catch (error) {
            console.error('Error editing message:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while editing message',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteMessage(req, res) {
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
            const message = await Message_1.default.findOne({
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
        }
        catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting message',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async markMessagesAsRead(req, res) {
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
            const participant = await ChatParticipant_1.default.findOne({
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
            await ChatParticipant_1.default.findByIdAndUpdate(participant._id, {
                lastMessageReadAt: new Date(),
                lastSeenAt: new Date()
            });
            const lastMessage = lastMessageId ? await Message_1.default.findById(lastMessageId) : null;
            const readUntil = lastMessage ? lastMessage.createdAt : new Date();
            await Message_1.default.updateMany({
                chatId,
                createdAt: { $lte: readUntil },
                senderId: { $ne: user.id },
                'readBy.userId': { $ne: user.id }
            }, {
                $push: {
                    readBy: {
                        userId: user.id,
                        userName: user.name,
                        readAt: new Date()
                    }
                }
            });
            res.status(200).json({
                success: true,
                message: 'Messages marked as read'
            });
        }
        catch (error) {
            console.error('Error marking messages as read:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while marking messages as read',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getChatParticipants(req, res) {
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
            const userParticipant = await ChatParticipant_1.default.findOne({
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
            const participants = await ChatParticipant_1.default.find({
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
        }
        catch (error) {
            console.error('Error fetching chat participants:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching participants',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateOnlineStatus(req, res) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
                return;
            }
            await ChatParticipant_1.default.updateMany({
                userId: user.id,
                isActive: true
            }, {
                lastSeenAt: new Date()
            });
            res.status(200).json({
                success: true,
                message: 'Online status updated'
            });
        }
        catch (error) {
            console.error('Error updating online status:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating status',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.ChatController = ChatController;
