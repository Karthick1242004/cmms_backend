"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmployeeQuery = exports.validateEmployeeId = exports.validateUpdateEmployee = exports.validateCreateEmployee = void 0;
const express_validator_1 = require("express-validator");
// Validation for creating a new employee
exports.validateCreateEmployee = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Employee name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Employee name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters'),
    (0, express_validator_1.body)('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[\+]?[\d\s\-\(\)]+$/)
        .withMessage('Please enter a valid phone number')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters')
        .trim(),
    (0, express_validator_1.body)('department')
        .notEmpty()
        .withMessage('Department is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Department must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('role')
        .notEmpty()
        .withMessage('Role is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Role must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive'),
    (0, express_validator_1.body)('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL')
        .isLength({ max: 500 })
        .withMessage('Avatar URL cannot exceed 500 characters')
];
// Validation for updating an employee
exports.validateUpdateEmployee = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid employee ID format'),
    (0, express_validator_1.body)('name')
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
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^[\+]?[\d\s\-\(\)]+$/)
        .withMessage('Please enter a valid phone number')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters')
        .trim(),
    (0, express_validator_1.body)('department')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Department must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('role')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Role must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive'),
    (0, express_validator_1.body)('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL')
        .isLength({ max: 500 })
        .withMessage('Avatar URL cannot exceed 500 characters')
];
// Validation for getting an employee by ID
exports.validateEmployeeId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid employee ID format')
];
// Validation for query parameters
exports.validateEmployeeQuery = [
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
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['active', 'inactive', 'all'])
        .withMessage('Status must be active, inactive, or all'),
    (0, express_validator_1.query)('department')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Department filter must be between 1 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.query)('role')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Role filter must be between 1 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['name', 'email', 'department', 'role', 'status', 'createdAt', 'updatedAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
];
//# sourceMappingURL=employeeValidation.js.map