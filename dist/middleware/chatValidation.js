"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateChat = exports.validateMessageQuery = exports.validateChatQuery = exports.validateMarkAsRead = exports.validateChatId = exports.validateMessageId = exports.validateEditMessage = exports.validateSendMessage = void 0;
const express_validator_1 = require("express-validator");
exports.validateSendMessage = [
    (0, express_validator_1.param)('chatId')
        .isMongoId()
        .withMessage('Valid chat ID is required'),
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Message content must be between 1 and 5000 characters'),
    (0, express_validator_1.body)('messageType')
        .optional()
        .isIn(['text', 'file', 'image'])
        .withMessage('Message type must be text, file, or image'),
    (0, express_validator_1.body)('replyTo')
        .optional()
        .isMongoId()
        .withMessage('Reply to must be a valid message ID'),
    (0, express_validator_1.body)('mentions')
        .optional()
        .isArray()
        .withMessage('Mentions must be an array')
        .custom((value) => {
        if (value && value.length > 0) {
            const isValid = value.every((id) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
            if (!isValid) {
                throw new Error('All mentions must be valid user IDs');
            }
        }
        return true;
    })
];
exports.validateEditMessage = [
    (0, express_validator_1.param)('messageId')
        .isMongoId()
        .withMessage('Valid message ID is required'),
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Message content must be between 1 and 5000 characters')
];
exports.validateMessageId = [
    (0, express_validator_1.param)('messageId')
        .isMongoId()
        .withMessage('Valid message ID is required')
];
exports.validateChatId = [
    (0, express_validator_1.param)('chatId')
        .isMongoId()
        .withMessage('Valid chat ID is required')
];
exports.validateMarkAsRead = [
    (0, express_validator_1.param)('chatId')
        .isMongoId()
        .withMessage('Valid chat ID is required'),
    (0, express_validator_1.body)('lastMessageId')
        .optional()
        .isMongoId()
        .withMessage('Last message ID must be valid if provided')
];
exports.validateChatQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
];
exports.validateMessageQuery = [
    (0, express_validator_1.param)('chatId')
        .isMongoId()
        .withMessage('Valid chat ID is required'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('before')
        .optional()
        .isISO8601()
        .withMessage('Before parameter must be a valid ISO date')
];
exports.validateCreateChat = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Chat name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['department', 'group', 'direct'])
        .withMessage('Chat type must be department, group, or direct'),
    (0, express_validator_1.body)('participants')
        .optional()
        .isArray()
        .withMessage('Participants must be an array')
        .custom((value) => {
        if (value && value.length > 0) {
            const isValid = value.every((id) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
            if (!isValid) {
                throw new Error('All participants must be valid user IDs');
            }
        }
        return true;
    })
];
