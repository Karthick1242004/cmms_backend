"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShiftDetailQuery = exports.validateShiftDetailId = exports.validateUpdateShiftDetail = exports.validateCreateShiftDetail = void 0;
const express_validator_1 = require("express-validator");
// Validation for creating a new shift detail
exports.validateCreateShiftDetail = [
    (0, express_validator_1.body)('employeeId')
        .isInt({ min: 1 })
        .withMessage('Employee ID must be a positive integer')
        .toInt(),
    (0, express_validator_1.body)('employeeName')
        .notEmpty()
        .withMessage('Employee name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Employee name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .trim(),
    (0, express_validator_1.body)('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters')
        .trim(),
    (0, express_validator_1.body)('department')
        .notEmpty()
        .withMessage('Department is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Department must be between 2 and 50 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('role')
        .notEmpty()
        .withMessage('Role is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Role must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('shiftType')
        .isIn(['day', 'night', 'rotating', 'on-call'])
        .withMessage('Shift type must be day, night, rotating, or on-call'),
    (0, express_validator_1.body)('shiftStartTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Shift start time must be in HH:MM format'),
    (0, express_validator_1.body)('shiftEndTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Shift end time must be in HH:MM format'),
    (0, express_validator_1.body)('workDays')
        .isArray()
        .withMessage('Work days must be an array')
        .custom((value) => {
        if (!Array.isArray(value))
            return false;
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return value.every(day => validDays.includes(day)) && value.length <= 7;
    })
        .withMessage('Work days must contain valid day names and not exceed 7 days'),
    (0, express_validator_1.body)('supervisor')
        .notEmpty()
        .withMessage('Supervisor is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Supervisor name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('location')
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'on-leave'])
        .withMessage('Status must be active, inactive, or on-leave'),
    (0, express_validator_1.body)('joinDate')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Join date must be in YYYY-MM-DD format'),
    (0, express_validator_1.body)('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL')
];
// Validation for updating a shift detail
exports.validateUpdateShiftDetail = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Invalid employee ID format')
        .toInt(),
    (0, express_validator_1.body)('employeeId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Employee ID must be a positive integer')
        .toInt(),
    (0, express_validator_1.body)('employeeName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Employee name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .trim(),
    (0, express_validator_1.body)('phone')
        .optional()
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters')
        .trim(),
    (0, express_validator_1.body)('department')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Department must be between 2 and 50 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('role')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Role must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('shiftType')
        .optional()
        .isIn(['day', 'night', 'rotating', 'on-call'])
        .withMessage('Shift type must be day, night, rotating, or on-call'),
    (0, express_validator_1.body)('shiftStartTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Shift start time must be in HH:MM format'),
    (0, express_validator_1.body)('shiftEndTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Shift end time must be in HH:MM format'),
    (0, express_validator_1.body)('workDays')
        .optional()
        .isArray()
        .withMessage('Work days must be an array')
        .custom((value) => {
        if (!Array.isArray(value))
            return false;
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return value.every(day => validDays.includes(day)) && value.length <= 7;
    })
        .withMessage('Work days must contain valid day names and not exceed 7 days'),
    (0, express_validator_1.body)('supervisor')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Supervisor name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('location')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'on-leave'])
        .withMessage('Status must be active, inactive, or on-leave'),
    (0, express_validator_1.body)('joinDate')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Join date must be in YYYY-MM-DD format'),
    (0, express_validator_1.body)('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL')
];
// Validation for getting a shift detail by ID
exports.validateShiftDetailId = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Invalid employee ID format')
        .toInt()
];
// Validation for query parameters
exports.validateShiftDetailQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.query)('department')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Department filter must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.query)('shiftType')
        .optional()
        .isIn(['day', 'night', 'rotating', 'on-call', 'all'])
        .withMessage('Shift type must be day, night, rotating, on-call, or all'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['active', 'inactive', 'on-leave', 'all'])
        .withMessage('Status must be active, inactive, on-leave, or all'),
    (0, express_validator_1.query)('location')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Location filter must be between 1 and 100 characters')
        .trim(),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['employeeName', 'department', 'shiftType', 'status', 'joinDate', 'createdAt', 'updatedAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
];
//# sourceMappingURL=shiftDetailValidation.js.map