import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { extractUserContext } from '../middleware/authMiddleware';
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

// ========== CHAT ROOMS ==========

// GET /api/chat/department - Get all chat rooms for user's department
router.get(
  '/department',
  extractUserContext,
  validateChatQuery,
  ChatController.getDepartmentChats
);

// GET /api/chat/department/room - Get or create department chat room
router.get(
  '/department/room',
  extractUserContext,
  ChatController.getOrCreateDepartmentChat
);

// ========== MESSAGES ==========

// GET /api/chat/:chatId/messages - Get messages for a chat room
router.get(
  '/:chatId/messages',
  extractUserContext,
  validateMessageQuery,
  ChatController.getChatMessages
);

// POST /api/chat/:chatId/messages - Send a new message
router.post(
  '/:chatId/messages',
  extractUserContext,
  validateSendMessage,
  ChatController.sendMessage
);

// PUT /api/chat/messages/:messageId - Edit a message
router.put(
  '/messages/:messageId',
  extractUserContext,
  validateEditMessage,
  ChatController.editMessage
);

// DELETE /api/chat/messages/:messageId - Delete a message
router.delete(
  '/messages/:messageId',
  extractUserContext,
  validateMessageId,
  ChatController.deleteMessage
);

// POST /api/chat/:chatId/read - Mark messages as read
router.post(
  '/:chatId/read',
  extractUserContext,
  validateMarkAsRead,
  ChatController.markMessagesAsRead
);

// ========== CHAT PARTICIPANTS ==========

// GET /api/chat/:chatId/participants - Get chat participants
router.get(
  '/:chatId/participants',
  extractUserContext,
  validateChatId,
  ChatController.getChatParticipants
);

// ========== USER STATUS ==========

// POST /api/chat/status/online - Update user's online status
router.post(
  '/status/online',
  extractUserContext,
  ChatController.updateOnlineStatus
);

export default router;
