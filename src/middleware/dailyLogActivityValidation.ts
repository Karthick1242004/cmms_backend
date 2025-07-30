import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateCreateDailyLogActivity = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  
  body('time')
    .notEmpty()
    .withMessage('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  
  body('area')
    .notEmpty()
    .withMessage('Area is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Area must be between 2 and 100 characters')
    .trim(),
  
  body('departmentId')
    .notEmpty()
    .withMessage('Department ID is required')
    .isLength({ min: 1 })
    .withMessage('Department ID cannot be empty'),
  
  body('departmentName')
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters')
    .trim(),
  
  body('assetId')
    .notEmpty()
    .withMessage('Asset ID is required')
    .isLength({ min: 1 })
    .withMessage('Asset ID cannot be empty'),
  
  body('assetName')
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Asset name must be between 2 and 200 characters')
    .trim(),
  
  body('natureOfProblem')
    .notEmpty()
    .withMessage('Nature of problem is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Nature of problem must be between 5 and 500 characters')
    .trim(),
  
  body('commentsOrSolution')
    .notEmpty()
    .withMessage('Comments or solution is required')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Comments or solution must be between 5 and 1000 characters')
    .trim(),
  
  body('attendedBy')
    .notEmpty()
    .withMessage('Attended by is required')
    .isLength({ min: 1 })
    .withMessage('Attended by cannot be empty'),
  
  body('attendedByName')
    .notEmpty()
    .withMessage('Attended by name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Attended by name must be between 2 and 100 characters')
    .trim(),
  
  body('verifiedBy')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Verified by cannot be empty if provided'),
  
  body('verifiedByName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Verified by name must be between 2 and 100 characters if provided')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'verified'])
    .withMessage('Status must be one of: open, in-progress, resolved, verified'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be one of: low, medium, high, critical'),
  
  handleValidationErrors
];

export const validateUpdateDailyLogActivity = [
  param('id')
    .notEmpty()
    .withMessage('Daily log activity ID is required')
    .isLength({ min: 1 })
    .withMessage('Invalid daily log activity ID'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  
  body('area')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Area must be between 2 and 100 characters')
    .trim(),
  
  body('departmentId')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Department ID cannot be empty'),
  
  body('departmentName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters')
    .trim(),
  
  body('assetId')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Asset ID cannot be empty'),
  
  body('assetName')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Asset name must be between 2 and 200 characters')
    .trim(),
  
  body('natureOfProblem')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Nature of problem must be between 5 and 500 characters')
    .trim(),
  
  body('commentsOrSolution')
    .optional()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Comments or solution must be between 5 and 1000 characters')
    .trim(),
  
  body('attendedBy')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Attended by cannot be empty'),
  
  body('attendedByName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Attended by name must be between 2 and 100 characters')
    .trim(),
  
  body('verifiedBy')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Verified by cannot be empty if provided'),
  
  body('verifiedByName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Verified by name must be between 2 and 100 characters if provided')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'verified'])
    .withMessage('Status must be one of: open, in-progress, resolved, verified'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be one of: low, medium, high, critical'),
  
  handleValidationErrors
];

export const validateGetDailyLogActivity = [
  param('id')
    .notEmpty()
    .withMessage('Daily log activity ID is required')
    .isLength({ min: 1 })
    .withMessage('Invalid daily log activity ID'),
  
  handleValidationErrors
];

export const validateQueryDailyLogActivities = [
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
    .trim(),
  
  query('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'verified'])
    .withMessage('Status must be one of: open, in-progress, resolved, verified'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be one of: low, medium, high, critical'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),
  
  handleValidationErrors
];

export const validateUpdateStatus = [
  param('id')
    .notEmpty()
    .withMessage('Daily log activity ID is required')
    .isLength({ min: 1 })
    .withMessage('Invalid daily log activity ID'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['open', 'in-progress', 'resolved', 'verified'])
    .withMessage('Status must be one of: open, in-progress, resolved, verified'),
  
  body('verifiedBy')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Verified by cannot be empty if provided'),
  
  body('verifiedByName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Verified by name must be between 2 and 100 characters if provided')
    .trim(),
  
  handleValidationErrors
];