import { body, param, query } from 'express-validator';

// Validation for sending a message
export const validateSendMessage = [
  param('chatId')
    .isMongoId()
    .withMessage('Valid chat ID is required'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters'),
  
  body('messageType')
    .optional()
    .isIn(['text', 'file', 'image'])
    .withMessage('Message type must be text, file, or image'),
  
  body('replyTo')
    .optional()
    .isMongoId()
    .withMessage('Reply to must be a valid message ID'),
  
  body('mentions')
    .optional()
    .isArray()
    .withMessage('Mentions must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const isValid = value.every((id: any) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
        if (!isValid) {
          throw new Error('All mentions must be valid user IDs');
        }
      }
      return true;
    })
];

// Validation for editing a message
export const validateEditMessage = [
  param('messageId')
    .isMongoId()
    .withMessage('Valid message ID is required'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters')
];

// Validation for message ID parameter
export const validateMessageId = [
  param('messageId')
    .isMongoId()
    .withMessage('Valid message ID is required')
];

// Validation for chat ID parameter
export const validateChatId = [
  param('chatId')
    .isMongoId()
    .withMessage('Valid chat ID is required')
];

// Validation for marking messages as read
export const validateMarkAsRead = [
  param('chatId')
    .isMongoId()
    .withMessage('Valid chat ID is required'),
  
  body('lastMessageId')
    .optional()
    .isMongoId()
    .withMessage('Last message ID must be valid if provided')
];

// Validation for chat query parameters
export const validateChatQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

// Validation for message query parameters
export const validateMessageQuery = [
  param('chatId')
    .isMongoId()
    .withMessage('Valid chat ID is required'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('before')
    .optional()
    .isISO8601()
    .withMessage('Before parameter must be a valid ISO date')
];

// Validation for creating a chat room
export const validateCreateChat = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Chat name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('type')
    .optional()
    .isIn(['department', 'group', 'direct'])
    .withMessage('Chat type must be department, group, or direct'),
  
  body('participants')
    .optional()
    .isArray()
    .withMessage('Participants must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const isValid = value.every((id: any) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
        if (!isValid) {
          throw new Error('All participants must be valid user IDs');
        }
      }
      return true;
    })
];
