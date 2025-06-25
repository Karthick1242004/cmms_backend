import { body, param, query } from 'express-validator';

// ========== MAINTENANCE SCHEDULE VALIDATIONS ==========

// Validation for creating a new maintenance schedule
export const validateCreateSchedule = [
  body('assetId')
    .notEmpty()
    .withMessage('Asset ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Asset ID must be between 1 and 50 characters')
    .trim(),

  body('assetName')
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Asset name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('assetTag')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Asset tag cannot exceed 50 characters')
    .trim(),

  body('assetType')
    .notEmpty()
    .withMessage('Asset type is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Asset type must be between 2 and 50 characters')
    .trim()
    .escape(),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('title')
    .notEmpty()
    .withMessage('Maintenance title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters')
    .trim()
    .escape(),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
    .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),

  body('customFrequencyDays')
    .optional()
    .isInt({ min: 1, max: 3650 })
    .withMessage('Custom frequency must be between 1 and 3650 days')
    .toInt(),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date')
    .toDate(),

  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),

  body('estimatedDuration')
    .notEmpty()
    .withMessage('Estimated duration is required')
    .isFloat({ min: 0.1, max: 168 })
    .withMessage('Estimated duration must be between 0.1 and 168 hours')
    .toFloat(),

  body('assignedTechnician')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Assigned technician name cannot exceed 100 characters')
    .trim()
    .escape(),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'completed', 'overdue'])
    .withMessage('Status must be active, inactive, completed, or overdue'),

  body('createdBy')
    .notEmpty()
    .withMessage('Created by is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Created by must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('parts')
    .optional()
    .isArray()
    .withMessage('Parts must be an array'),

  body('parts.*.partId')
    .if(body('parts').exists())
    .notEmpty()
    .withMessage('Part ID is required')
    .trim(),

  body('parts.*.partName')
    .if(body('parts').exists())
    .notEmpty()
    .withMessage('Part name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Part name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('parts.*.partSku')
    .if(body('parts').exists())
    .notEmpty()
    .withMessage('Part SKU is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Part SKU must be between 1 and 50 characters')
    .trim(),

  body('parts.*.estimatedTime')
    .if(body('parts').exists())
    .notEmpty()
    .withMessage('Estimated time is required')
    .isInt({ min: 1, max: 1440 })
    .withMessage('Estimated time must be between 1 and 1440 minutes')
    .toInt(),

  body('parts.*.requiresReplacement')
    .if(body('parts').exists())
    .optional()
    .isBoolean()
    .withMessage('Requires replacement must be a boolean')
    .toBoolean(),

  body('parts.*.replacementFrequency')
    .if(body('parts').exists())
    .optional()
    .isInt({ min: 1 })
    .withMessage('Replacement frequency must be at least 1')
    .toInt(),

  body('parts.*.checklistItems')
    .if(body('parts').exists())
    .optional()
    .isArray()
    .withMessage('Checklist items must be an array'),

  body('parts.*.checklistItems.*.description')
    .if(body('parts.*.checklistItems').exists())
    .notEmpty()
    .withMessage('Checklist item description is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters')
    .trim()
    .escape(),

  body('parts.*.checklistItems.*.isRequired')
    .if(body('parts.*.checklistItems').exists())
    .optional()
    .isBoolean()
    .withMessage('Is required must be a boolean')
    .toBoolean(),

  body('parts.*.checklistItems.*.notes')
    .if(body('parts.*.checklistItems').exists())
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
    .trim()
    .escape(),
];

// Validation for updating a maintenance schedule
export const validateUpdateSchedule = [
  param('id')
    .isMongoId()
    .withMessage('Invalid maintenance schedule ID format'),

  body('assetId')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Asset ID must be between 1 and 50 characters')
    .trim(),

  body('assetName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Asset name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('assetTag')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Asset tag cannot exceed 50 characters')
    .trim(),

  body('assetType')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Asset type must be between 2 and 50 characters')
    .trim()
    .escape(),

  body('location')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters')
    .trim()
    .escape(),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
    .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),

  body('customFrequencyDays')
    .optional()
    .isInt({ min: 1, max: 3650 })
    .withMessage('Custom frequency must be between 1 and 3650 days')
    .toInt(),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date')
    .toDate(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),

  body('estimatedDuration')
    .optional()
    .isFloat({ min: 0.1, max: 168 })
    .withMessage('Estimated duration must be between 0.1 and 168 hours')
    .toFloat(),

  body('assignedTechnician')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Assigned technician name cannot exceed 100 characters')
    .trim()
    .escape(),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'completed', 'overdue'])
    .withMessage('Status must be active, inactive, completed, or overdue'),
];

// ========== MAINTENANCE RECORD VALIDATIONS ==========

// Validation for creating a new maintenance record
export const validateCreateRecord = [
  body('scheduleId')
    .notEmpty()
    .withMessage('Schedule ID is required')
    .isMongoId()
    .withMessage('Invalid schedule ID format'),

  body('assetId')
    .notEmpty()
    .withMessage('Asset ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Asset ID must be between 1 and 50 characters')
    .trim(),

  body('assetName')
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Asset name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('completedDate')
    .notEmpty()
    .withMessage('Completed date is required')
    .isISO8601()
    .withMessage('Completed date must be a valid ISO 8601 date')
    .toDate(),

  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format')
    .trim(),

  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format')
    .trim(),

  body('actualDuration')
    .notEmpty()
    .withMessage('Actual duration is required')
    .isFloat({ min: 0, max: 168 })
    .withMessage('Actual duration must be between 0 and 168 hours')
    .toFloat(),

  body('technician')
    .notEmpty()
    .withMessage('Technician name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Technician name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('technicianId')
    .notEmpty()
    .withMessage('Technician ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Technician ID must be between 1 and 50 characters')
    .trim(),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
    .withMessage('Status must be completed, partially_completed, failed, or in_progress'),

  body('overallCondition')
    .notEmpty()
    .withMessage('Overall condition is required')
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('Overall condition must be excellent, good, fair, or poor'),

  body('notes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters')
    .trim()
    .escape(),

  body('partsStatus')
    .optional()
    .isArray()
    .withMessage('Parts status must be an array'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

  body('adminVerified')
    .optional()
    .isBoolean()
    .withMessage('Admin verified must be a boolean')
    .toBoolean(),

  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
    .trim()
    .escape(),
];

// Validation for updating a maintenance record
export const validateUpdateRecord = [
  param('id')
    .isMongoId()
    .withMessage('Invalid maintenance record ID format'),

  body('completedDate')
    .optional()
    .isISO8601()
    .withMessage('Completed date must be a valid ISO 8601 date')
    .toDate(),

  body('startTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format')
    .trim(),

  body('endTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format')
    .trim(),

  body('actualDuration')
    .optional()
    .isFloat({ min: 0, max: 168 })
    .withMessage('Actual duration must be between 0 and 168 hours')
    .toFloat(),

  body('technician')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Technician name must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('status')
    .optional()
    .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
    .withMessage('Status must be completed, partially_completed, failed, or in_progress'),

  body('overallCondition')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('Overall condition must be excellent, good, fair, or poor'),

  body('notes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters')
    .trim()
    .escape(),

  body('adminVerified')
    .optional()
    .isBoolean()
    .withMessage('Admin verified must be a boolean')
    .toBoolean(),

  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
    .trim()
    .escape(),
];

// Validation for verifying a maintenance record
export const validateVerifyRecord = [
  param('id')
    .isMongoId()
    .withMessage('Invalid maintenance record ID format'),

  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
    .trim()
    .escape(),

  body('adminVerifiedBy')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Admin verified by must be between 2 and 100 characters')
    .trim()
    .escape(),
];

// ========== GENERAL VALIDATIONS ==========

// Validation for getting by ID
export const validateMaintenanceId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid maintenance ID format')
];

// Validation for schedule query parameters
export const validateScheduleQuery = [
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
    .isIn(['active', 'inactive', 'completed', 'overdue', 'all'])
    .withMessage('Status must be active, inactive, completed, overdue, or all'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical', 'all'])
    .withMessage('Priority must be low, medium, high, critical, or all'),

  query('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom', 'all'])
    .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, custom, or all'),

  query('assignedTechnician')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Assigned technician must be between 1 and 100 characters')
    .trim()
    .escape(),

  query('sortBy')
    .optional()
    .isIn(['title', 'assetName', 'location', 'priority', 'frequency', 'nextDueDate', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Validation for record query parameters
export const validateRecordQuery = [
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
    .isIn(['completed', 'partially_completed', 'failed', 'in_progress', 'verified', 'pending', 'all'])
    .withMessage('Status must be completed, partially_completed, failed, in_progress, verified, pending, or all'),

  query('technician')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Technician must be between 1 and 100 characters')
    .trim()
    .escape(),

  query('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean')
    .toBoolean(),

  query('sortBy')
    .optional()
    .isIn(['assetName', 'technician', 'completedDate', 'status', 'overallCondition', 'adminVerified', 'createdAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
]; 