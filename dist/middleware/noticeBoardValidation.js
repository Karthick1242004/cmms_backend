"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMarkAsViewed = exports.validateGetNotices = exports.validatePublishNotice = exports.validateUpdateNotice = exports.validateCreateNotice = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateCreateNotice = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .trim(),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 1, max: 5000 })
        .withMessage('Content must be between 1 and 5000 characters')
        .trim(),
    (0, express_validator_1.body)('type')
        .isIn(['text', 'link', 'file'])
        .withMessage('Type must be one of: text, link, file'),
    (0, express_validator_1.body)('linkUrl')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL'),
    (0, express_validator_1.body)('fileName')
        .optional()
        .isLength({ max: 255 })
        .withMessage('File name must not exceed 255 characters')
        .trim(),
    (0, express_validator_1.body)('fileType')
        .optional()
        .isLength({ max: 100 })
        .withMessage('File type must not exceed 100 characters')
        .trim(),
    (0, express_validator_1.body)('priority')
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Priority must be one of: low, medium, high, urgent'),
    (0, express_validator_1.body)('targetAudience')
        .isIn(['all', 'department', 'role'])
        .withMessage('Target audience must be one of: all, department, role'),
    (0, express_validator_1.body)('targetDepartments')
        .optional()
        .isArray()
        .withMessage('Target departments must be an array')
        .custom((value, { req }) => {
        if (req.body.targetAudience === 'department' && (!value || value.length === 0)) {
            throw new Error('Target departments are required when target audience is department');
        }
        return true;
    }),
    (0, express_validator_1.body)('targetRoles')
        .optional()
        .isArray()
        .withMessage('Target roles must be an array')
        .custom((value, { req }) => {
        if (req.body.targetAudience === 'role' && (!value || value.length === 0)) {
            throw new Error('Target roles are required when target audience is role');
        }
        return true;
    }),
    (0, express_validator_1.body)('expiresAt')
        .optional()
        .isISO8601()
        .withMessage('Expires at must be a valid date')
        .custom((value) => {
        if (value && new Date(value) <= new Date()) {
            throw new Error('Expiration date must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)().custom((value) => {
        const { type, linkUrl } = value;
        if ((type === 'link' || type === 'file') && !linkUrl) {
            throw new Error('Link URL is required for link and file type notices');
        }
        return true;
    }),
    exports.handleValidationErrors
];
exports.validateUpdateNotice = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .trim(),
    (0, express_validator_1.body)('content')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Content must be between 1 and 5000 characters')
        .trim(),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['text', 'link', 'file'])
        .withMessage('Type must be one of: text, link, file'),
    (0, express_validator_1.body)('linkUrl')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL'),
    (0, express_validator_1.body)('fileName')
        .optional()
        .isLength({ max: 255 })
        .withMessage('File name must not exceed 255 characters')
        .trim(),
    (0, express_validator_1.body)('fileType')
        .optional()
        .isLength({ max: 100 })
        .withMessage('File type must not exceed 100 characters')
        .trim(),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Priority must be one of: low, medium, high, urgent'),
    (0, express_validator_1.body)('targetAudience')
        .optional()
        .isIn(['all', 'department', 'role'])
        .withMessage('Target audience must be one of: all, department, role'),
    (0, express_validator_1.body)('targetDepartments')
        .optional()
        .isArray()
        .withMessage('Target departments must be an array'),
    (0, express_validator_1.body)('targetRoles')
        .optional()
        .isArray()
        .withMessage('Target roles must be an array'),
    (0, express_validator_1.body)('expiresAt')
        .optional()
        .isISO8601()
        .withMessage('Expires at must be a valid date')
        .custom((value) => {
        if (value && new Date(value) <= new Date()) {
            throw new Error('Expiration date must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters')
        .trim(),
    exports.handleValidationErrors
];
exports.validatePublishNotice = [
    (0, express_validator_1.body)('isPublished')
        .isBoolean()
        .withMessage('isPublished must be a boolean value'),
    exports.handleValidationErrors
];
exports.validateGetNotices = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Priority must be one of: low, medium, high, urgent'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['text', 'link', 'file'])
        .withMessage('Type must be one of: text, link, file'),
    (0, express_validator_1.query)('targetAudience')
        .optional()
        .isIn(['all', 'department', 'role'])
        .withMessage('Target audience must be one of: all, department, role'),
    (0, express_validator_1.query)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value'),
    (0, express_validator_1.query)('isPublished')
        .optional()
        .isBoolean()
        .withMessage('isPublished must be a boolean value'),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Search term must not exceed 100 characters')
        .trim(),
    (0, express_validator_1.query)('tags')
        .optional()
        .custom((value) => {
        if (typeof value === 'string') {
            return true;
        }
        if (Array.isArray(value)) {
            return value.every(tag => typeof tag === 'string');
        }
        throw new Error('Tags must be a string or array of strings');
    }),
    exports.handleValidationErrors
];
exports.validateMarkAsViewed = [
    exports.handleValidationErrors
];
