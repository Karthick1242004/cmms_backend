"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateActionItem = exports.validateUpdateMeetingMinutes = exports.validateCreateMeetingMinutes = exports.validateMeetingMinutesQuery = exports.validateMeetingMinutesId = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_2.validationResult)(req);
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
exports.validateMeetingMinutesId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid meeting minutes ID format'),
];
exports.validateMeetingMinutesQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('department')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Department must be between 1 and 100 characters'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['draft', 'published', 'archived', 'all'])
        .withMessage('Status must be draft, published, archived, or all'),
    (0, express_validator_1.query)('search')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Search term must be between 1 and 200 characters'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['title', 'department', 'meetingDateTime', 'createdAt', 'createdByName'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    (0, express_validator_1.query)('dateFrom')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format for dateFrom'),
    (0, express_validator_1.query)('dateTo')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format for dateTo'),
];
exports.validateCreateMeetingMinutes = [
    (0, express_validator_1.body)('title')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    (0, express_validator_1.body)('department')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Department is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Department must be between 2 and 100 characters'),
    (0, express_validator_1.body)('meetingDateTime')
        .isISO8601()
        .withMessage('Valid meeting date and time is required'),
    (0, express_validator_1.body)('purpose')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Meeting purpose is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Purpose must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('minutes')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Meeting minutes content is required')
        .isLength({ min: 20, max: 10000 })
        .withMessage('Minutes must be between 20 and 10000 characters'),
    (0, express_validator_1.body)('attendees')
        .optional()
        .isArray()
        .withMessage('Attendees must be an array'),
    (0, express_validator_1.body)('attendees.*')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Each attendee name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be draft, published, or archived'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),
    (0, express_validator_1.body)('duration')
        .optional()
        .isInt({ min: 1, max: 480 })
        .withMessage('Duration must be between 1 and 480 minutes'),
    (0, express_validator_1.body)('actionItems')
        .optional()
        .isArray()
        .withMessage('Action items must be an array'),
    (0, express_validator_1.body)('actionItems.*.description')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Action item description is required')
        .isLength({ min: 5, max: 500 })
        .withMessage('Action item description must be between 5 and 500 characters'),
    (0, express_validator_1.body)('actionItems.*.assignedTo')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Action item must be assigned to someone'),
    (0, express_validator_1.body)('actionItems.*.dueDate')
        .optional()
        .isISO8601()
        .withMessage('Valid due date is required for action items'),
    (0, express_validator_1.body)('actionItems.*.status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Action item status must be pending, in-progress, or completed'),
];
exports.validateUpdateMeetingMinutes = [
    (0, express_validator_1.body)('title')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    (0, express_validator_1.body)('department')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Department must be between 2 and 100 characters'),
    (0, express_validator_1.body)('meetingDateTime')
        .optional()
        .isISO8601()
        .withMessage('Valid meeting date and time is required'),
    (0, express_validator_1.body)('purpose')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Purpose must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('minutes')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 20, max: 10000 })
        .withMessage('Minutes must be between 20 and 10000 characters'),
    (0, express_validator_1.body)('attendees')
        .optional()
        .isArray()
        .withMessage('Attendees must be an array'),
    (0, express_validator_1.body)('attendees.*')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Each attendee name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be draft, published, or archived'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),
    (0, express_validator_1.body)('duration')
        .optional()
        .isInt({ min: 1, max: 480 })
        .withMessage('Duration must be between 1 and 480 minutes'),
    (0, express_validator_1.body)('actionItems')
        .optional()
        .isArray()
        .withMessage('Action items must be an array'),
    (0, express_validator_1.body)('actionItems.*.description')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('Action item description must be between 5 and 500 characters'),
    (0, express_validator_1.body)('actionItems.*.assignedTo')
        .optional()
        .isString()
        .trim()
        .withMessage('Action item assignee is required'),
    (0, express_validator_1.body)('actionItems.*.dueDate')
        .optional()
        .isISO8601()
        .withMessage('Valid due date is required for action items'),
    (0, express_validator_1.body)('actionItems.*.status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Action item status must be pending, in-progress, or completed'),
];
exports.validateUpdateActionItem = [
    (0, express_validator_1.body)('actionItemId')
        .isString()
        .notEmpty()
        .withMessage('Action item ID is required'),
    (0, express_validator_1.body)('status')
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed'),
];
