import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Helper function to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
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

// Validation for creating a notice
export const validateCreateNotice = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .trim(),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters')
    .trim(),
  
  body('type')
    .isIn(['text', 'link', 'file'])
    .withMessage('Type must be one of: text, link, file'),
  
  body('linkUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  
  body('fileName')
    .optional()
    .isLength({ max: 255 })
    .withMessage('File name must not exceed 255 characters')
    .trim(),
  
  body('fileType')
    .optional()
    .isLength({ max: 100 })
    .withMessage('File type must not exceed 100 characters')
    .trim(),
  
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  body('targetAudience')
    .isIn(['all', 'department', 'role'])
    .withMessage('Target audience must be one of: all, department, role'),
  
  body('targetDepartments')
    .optional()
    .isArray()
    .withMessage('Target departments must be an array')
    .custom((value, { req }) => {
      if (req.body.targetAudience === 'department' && (!value || value.length === 0)) {
        throw new Error('Target departments are required when target audience is department');
      }
      return true;
    }),
  
  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('Target roles must be an array')
    .custom((value, { req }) => {
      if (req.body.targetAudience === 'role' && (!value || value.length === 0)) {
        throw new Error('Target roles are required when target audience is role');
      }
      return true;
    }),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid date')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .trim(),
  
  // Custom validation for URL based on type
  body().custom((value) => {
    const { type, linkUrl } = value;
    if ((type === 'link' || type === 'file') && !linkUrl) {
      throw new Error('Link URL is required for link and file type notices');
    }
    return true;
  }),
  
  handleValidationErrors
];

// Validation for updating a notice
export const validateUpdateNotice = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .trim(),
  
  body('content')
    .optional()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters')
    .trim(),
  
  body('type')
    .optional()
    .isIn(['text', 'link', 'file'])
    .withMessage('Type must be one of: text, link, file'),
  
  body('linkUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  
  body('fileName')
    .optional()
    .isLength({ max: 255 })
    .withMessage('File name must not exceed 255 characters')
    .trim(),
  
  body('fileType')
    .optional()
    .isLength({ max: 100 })
    .withMessage('File type must not exceed 100 characters')
    .trim(),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  body('targetAudience')
    .optional()
    .isIn(['all', 'department', 'role'])
    .withMessage('Target audience must be one of: all, department, role'),
  
  body('targetDepartments')
    .optional()
    .isArray()
    .withMessage('Target departments must be an array'),
  
  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('Target roles must be an array'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid date')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .trim(),
  
  handleValidationErrors
];

// Validation for publishing/unpublishing notice
export const validatePublishNotice = [
  body('isPublished')
    .isBoolean()
    .withMessage('isPublished must be a boolean value'),
  
  handleValidationErrors
];

// Validation for query parameters
export const validateGetNotices = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  query('type')
    .optional()
    .isIn(['text', 'link', 'file'])
    .withMessage('Type must be one of: text, link, file'),
  
  query('targetAudience')
    .optional()
    .isIn(['all', 'department', 'role'])
    .withMessage('Target audience must be one of: all, department, role'),
  
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  query('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean value'),
  
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters')
    .trim(),
  
  query('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        return true; // Single tag as string
      }
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string');
      }
      throw new Error('Tags must be a string or array of strings');
    }),
  
  handleValidationErrors
];

// Validation for marking notice as viewed
export const validateMarkAsViewed = [
  // No additional validation needed as user context comes from headers
  handleValidationErrors
];