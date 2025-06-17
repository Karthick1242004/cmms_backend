import { body, param, query } from 'express-validator';

// Validation for creating a new department
export const validateCreateDepartment = [
  body('name')
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('description')
    .notEmpty()
    .withMessage('Department description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim()
    .escape(),

  body('manager')
    .notEmpty()
    .withMessage('Manager name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Manager name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('employeeCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Employee count must be a non-negative integer')
    .toInt(),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
];

// Validation for updating a department
export const validateUpdateDepartment = [
  param('id')
    .isMongoId()
    .withMessage('Invalid department ID format'),

  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim()
    .escape(),

  body('manager')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Manager name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('employeeCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Employee count must be a non-negative integer')
    .toInt(),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
];

// Validation for getting a department by ID
export const validateDepartmentId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid department ID format')
];

// Validation for query parameters
export const validateDepartmentQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim()
    .escape(),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'all'])
    .withMessage('Status must be active, inactive, or all'),

  query('sortBy')
    .optional()
    .isIn(['name', 'manager', 'employeeCount', 'status', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
]; 