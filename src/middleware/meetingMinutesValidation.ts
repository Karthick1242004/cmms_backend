import { body, param, query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Custom validation function to handle validation results
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

// Validate Meeting Minutes ID parameter
export const validateMeetingMinutesId: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid meeting minutes ID format'),
];

// Validate query parameters for getting meeting minutes
export const validateMeetingMinutesQuery: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('department')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Department must be between 1 and 100 characters'),
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived', 'all'])
    .withMessage('Status must be draft, published, archived, or all'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search term must be between 1 and 200 characters'),
  query('sortBy')
    .optional()
    .isIn(['title', 'department', 'meetingDateTime', 'createdAt', 'createdByName'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateFrom'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateTo'),
];

// Validate creating new meeting minutes
export const validateCreateMeetingMinutes: ValidationChain[] = [
  body('title')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('department')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  body('meetingDateTime')
    .isISO8601()
    .withMessage('Valid meeting date and time is required'),
  body('purpose')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Meeting purpose is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Purpose must be between 10 and 1000 characters'),
  body('minutes')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Meeting minutes content is required')
    .isLength({ min: 20, max: 10000 })
    .withMessage('Minutes must be between 20 and 10000 characters'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each attendee name must be between 1 and 100 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('location')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('actionItems')
    .optional()
    .isArray()
    .withMessage('Action items must be an array'),
  body('actionItems.*.description')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Action item description is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Action item description must be between 5 and 500 characters'),
  body('actionItems.*.assignedTo')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Action item must be assigned to someone'),
  body('actionItems.*.dueDate')
    .optional()
    .isISO8601()
    .withMessage('Valid due date is required for action items'),
  body('actionItems.*.status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Action item status must be pending, in-progress, or completed'),
];

// Validate updating meeting minutes
export const validateUpdateMeetingMinutes: ValidationChain[] = [
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('department')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  body('meetingDateTime')
    .optional()
    .isISO8601()
    .withMessage('Valid meeting date and time is required'),
  body('purpose')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Purpose must be between 10 and 1000 characters'),
  body('minutes')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 20, max: 10000 })
    .withMessage('Minutes must be between 20 and 10000 characters'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each attendee name must be between 1 and 100 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('location')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('actionItems')
    .optional()
    .isArray()
    .withMessage('Action items must be an array'),
  body('actionItems.*.description')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Action item description must be between 5 and 500 characters'),
  body('actionItems.*.assignedTo')
    .optional()
    .isString()
    .trim()
    .withMessage('Action item assignee is required'),
  body('actionItems.*.dueDate')
    .optional()
    .isISO8601()
    .withMessage('Valid due date is required for action items'),
  body('actionItems.*.status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Action item status must be pending, in-progress, or completed'),
];

// Validate updating action item status
export const validateUpdateActionItem: ValidationChain[] = [
  body('actionItemId')
    .isString()
    .notEmpty()
    .withMessage('Action item ID is required'),
  body('status')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
];