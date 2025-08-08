import { body, param, query } from 'express-validator';

// Validation for creating a new employee
export const validateCreateEmployee = [
  body('name')
    .notEmpty()
    .withMessage('Employee name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Employee name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[\d\s\-\(\)]+$/)
    .withMessage('Please enter a valid phone number')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters')
    .trim(),

  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'on-leave'])
    .withMessage('Status must be either active, inactive, or on-leave'),

  body('avatar')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Avatar URL cannot exceed 500 characters')
];

// Validation for updating an employee
export const validateUpdateEmployee = [
  param('id')
    .custom((value) => {
      // Allow MongoDB ObjectId format OR custom employee ID formats
      const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
      const employeeIdRegex1 = /^[A-Z]+-[A-Z]+-\d+$/; // Format: EMP-ADMIN-001, SUPER-ADMIN-001
      const employeeIdRegex2 = /^[A-Z]+\d+$/; // Format: IT001, QA001, PE004
      
      if (mongoIdRegex.test(value) || employeeIdRegex1.test(value) || employeeIdRegex2.test(value)) {
        return true;
      }
      throw new Error('Invalid employee ID format');
    }),

  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Employee name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),

  body('phone')
    .optional()
    .matches(/^[\+]?[\d\s\-\(\)]+$/)
    .withMessage('Please enter a valid phone number')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters')
    .trim(),

  body('department')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('role')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'on-leave'])
    .withMessage('Status must be either active, inactive, or on-leave'),

  body('avatar')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Avatar URL cannot exceed 500 characters')
];

// Validation for getting an employee by ID
export const validateEmployeeId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid employee ID format')
];

// Validation for query parameters
export const validateEmployeeQuery = [
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
    .isIn(['active', 'inactive', 'on-leave', 'all'])
    .withMessage('Status must be active, inactive, on-leave, or all'),

  query('department')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Department filter must be between 1 and 100 characters')
    .trim()
    .escape(),

  query('role')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role filter must be between 1 and 100 characters')
    .trim()
    .escape(),

  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'department', 'role', 'status', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
]; 