"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDepartmentQuery = exports.validateDepartmentId = exports.validateUpdateDepartment = exports.validateCreateDepartment = void 0;
const express_validator_1 = require("express-validator");
// Validation for creating a new department
exports.validateCreateDepartment = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Department name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Department name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Department description is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('manager')
        .notEmpty()
        .withMessage('Manager name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Manager name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('employeeCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Employee count must be a non-negative integer')
        .toInt(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive')
];
// Validation for updating a department
exports.validateUpdateDepartment = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid department ID format'),
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Department name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('manager')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Manager name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('employeeCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Employee count must be a non-negative integer')
        .toInt(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive')
];
// Validation for getting a department by ID
exports.validateDepartmentId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid department ID format')
];
// Validation for query parameters
exports.validateDepartmentQuery = [
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
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['name', 'manager', 'employeeCount', 'status', 'createdAt', 'updatedAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
];
//# sourceMappingURL=departmentValidation.js.map