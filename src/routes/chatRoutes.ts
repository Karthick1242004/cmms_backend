import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { 
  validateJWT, 
  requireAuth, 
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';
import {
  validateSendMessage,
  validateEditMessage,
  validateMessageId,
  validateChatId,
  validateMarkAsRead,
  validateChatQuery,
  validateMessageQuery,
  validateCreateChat
} from '../middleware/chatValidation';

const router = Router();

// Apply JWT validation to all routes
router.use(validateJWT);

// ========== CHAT ROOMS ==========

// GET /api/chat/department - Get all chat rooms for user's department
// All authenticated users can access their department chats
router.get(
  '/department',
  enforceDepartmentAccess,
  validateChatQuery,
  ChatController.getDepartmentChats
);

// GET /api/chat/department/room - Get or create department chat room
// All authenticated users can access their department chat room
router.get(
  '/department/room',
  enforceDepartmentAccess,
  ChatController.getOrCreateDepartmentChat
);

// ========== MESSAGES ==========

// GET /api/chat/:chatId/messages - Get messages for a chat room
// All authenticated users can read messages (with access control in controller)
router.get(
  '/:chatId/messages',
  validateMessageQuery,
  ChatController.getChatMessages
);

// POST /api/chat/:chatId/messages - Send a new message
// All authenticated users can send messages
router.post(
  '/:chatId/messages',
  validateSendMessage,
  ChatController.sendMessage
);

// PUT /api/chat/messages/:messageId - Edit a message
// Users can edit their own messages (controlled in controller)
router.put(
  '/messages/:messageId',
  validateEditMessage,
  ChatController.editMessage
);

// DELETE /api/chat/messages/:messageId - Delete a message
// Users can delete their own messages, admins can delete any
router.delete(
  '/messages/:messageId',
  validateMessageId,
  ChatController.deleteMessage
);

// POST /api/chat/:chatId/read - Mark messages as read
// All authenticated users can mark messages as read
router.post(
  '/:chatId/read',
  validateMarkAsRead,
  ChatController.markMessagesAsRead
);

// ========== CHAT PARTICIPANTS ==========

// GET /api/chat/:chatId/participants - Get chat participants
// All authenticated users can view chat participants
router.get(
  '/:chatId/participants',
  validateChatId,
  ChatController.getChatParticipants
);

// ========== USER STATUS ==========

// POST /api/chat/status/online - Update user's online status
// All authenticated users can update their status
router.post(
  '/status/online',
  ChatController.updateOnlineStatus
);

export default router;
