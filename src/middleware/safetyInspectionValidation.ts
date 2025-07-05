import { body, param, query } from 'express-validator';

// Schedule validation
export const validateCreateSafetyInspectionSchedule = [
  body('assetId')
    .trim()
    .notEmpty()
    .withMessage('Asset ID is required')
    .isLength({ max: 50 })
    .withMessage('Asset ID cannot exceed 50 characters'),
  
  body('assetName')
    .trim()
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ max: 100 })
    .withMessage('Asset name cannot exceed 100 characters'),
  
  body('assetTag')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Asset tag cannot exceed 50 characters'),
  
  body('assetType')
    .trim()
    .notEmpty()
    .withMessage('Asset type is required')
    .isLength({ max: 50 })
    .withMessage('Asset type cannot exceed 50 characters'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Inspection title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('frequency')
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
    .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
  
  body('customFrequencyDays')
    .optional()
    .isInt({ min: 1, max: 3650 })
    .withMessage('Custom frequency must be between 1 and 3650 days'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('priority')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),
  
  body('riskLevel')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Risk level must be low, medium, high, or critical'),
  
  body('estimatedDuration')
    .isFloat({ min: 0.1, max: 168 })
    .withMessage('Estimated duration must be between 0.1 and 168 hours'),
  
  body('assignedInspector')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned inspector cannot exceed 100 characters'),
  
  body('safetyStandards')
    .isArray()
    .withMessage('Safety standards must be an array'),
  
  body('safetyStandards.*')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each safety standard cannot exceed 50 characters'),
  
  body('createdBy')
    .trim()
    .notEmpty()
    .withMessage('Created by is required')
    .isLength({ max: 100 })
    .withMessage('Created by cannot exceed 100 characters'),
  
  body('checklistCategories')
    .isArray({ min: 1 })
    .withMessage('At least one checklist category is required'),
  
  body('checklistCategories.*.categoryName')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  
  body('checklistCategories.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Category description cannot exceed 500 characters'),
  
  body('checklistCategories.*.weight')
    .isInt({ min: 1, max: 100 })
    .withMessage('Category weight must be between 1 and 100'),
  
  body('checklistCategories.*.checklistItems')
    .isArray({ min: 1 })
    .withMessage('Each category must have at least one checklist item'),
  
  body('checklistCategories.*.checklistItems.*.description')
    .trim()
    .notEmpty()
    .withMessage('Checklist item description is required')
    .isLength({ max: 200 })
    .withMessage('Checklist item description cannot exceed 200 characters'),
  
  body('checklistCategories.*.checklistItems.*.safetyStandard')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Safety standard cannot exceed 100 characters'),
  
  body('checklistCategories.*.checklistItems.*.riskLevel')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Risk level must be low, medium, high, or critical'),
];

export const validateUpdateSafetyInspectionSchedule = [
  param('id')
    .isMongoId()
    .withMessage('Invalid schedule ID'),
  
  body('assetId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Asset ID cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Asset ID cannot exceed 50 characters'),
  
  body('assetName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Asset name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Asset name cannot exceed 100 characters'),
  
  body('assetTag')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Asset tag cannot exceed 50 characters'),
  
  body('assetType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Asset type cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Asset type cannot exceed 50 characters'),
  
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
    .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),
  
  body('riskLevel')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Risk level must be low, medium, high, or critical'),
  
  body('estimatedDuration')
    .optional()
    .isFloat({ min: 0.1, max: 168 })
    .withMessage('Estimated duration must be between 0.1 and 168 hours'),
];

// Record validation
export const validateCreateSafetyInspectionRecord = [
  body('scheduleId')
    .trim()
    .notEmpty()
    .withMessage('Schedule ID is required'),
  
  body('assetId')
    .trim()
    .notEmpty()
    .withMessage('Asset ID is required'),
  
  body('assetName')
    .trim()
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ max: 100 })
    .withMessage('Asset name cannot exceed 100 characters'),
  
  body('completedDate')
    .isISO8601()
    .withMessage('Completed date must be a valid date'),
  
  body('startTime')
    .trim()
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('endTime')
    .trim()
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('actualDuration')
    .isFloat({ min: 0, max: 168 })
    .withMessage('Actual duration must be between 0 and 168 hours'),
  
  body('inspector')
    .trim()
    .notEmpty()
    .withMessage('Inspector is required')
    .isLength({ max: 100 })
    .withMessage('Inspector name cannot exceed 100 characters'),
  
  body('inspectorId')
    .trim()
    .notEmpty()
    .withMessage('Inspector ID is required'),
  
  body('status')
    .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
    .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
  
  body('overallComplianceScore')
    .isInt({ min: 0, max: 100 })
    .withMessage('Overall compliance score must be between 0 and 100'),
  
  body('complianceStatus')
    .isIn(['compliant', 'non_compliant', 'requires_attention'])
    .withMessage('Compliance status must be compliant, non_compliant, or requires_attention'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('categoryResults')
    .isArray()
    .withMessage('Category results must be an array'),
  
  body('violations')
    .optional()
    .isArray()
    .withMessage('Violations must be an array'),
];

export const validateUpdateSafetyInspectionRecord = [
  param('id')
    .isMongoId()
    .withMessage('Invalid record ID'),
  
  body('status')
    .optional()
    .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
    .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
  
  body('overallComplianceScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Overall compliance score must be between 0 and 100'),
  
  body('complianceStatus')
    .optional()
    .isIn(['compliant', 'non_compliant', 'requires_attention'])
    .withMessage('Compliance status must be compliant, non_compliant, or requires_attention'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

export const validateVerifySafetyInspectionRecord = [
  param('id')
    .isMongoId()
    .withMessage('Invalid record ID'),
  
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters'),
  
  body('adminVerifiedBy')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Admin verified by cannot exceed 100 characters'),
];

// Common parameter validation
export const validateIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

// Query parameter validation
export const validateScheduleQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'completed', 'overdue'])
    .withMessage('Status must be active, inactive, completed, or overdue'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),
  
  query('riskLevel')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Risk level must be low, medium, high, or critical'),
  
  query('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
    .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
  
  query('sortBy')
    .optional()
    .isIn(['nextDueDate', 'priority', 'riskLevel', 'title', 'assetName', 'createdAt'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

export const validateRecordQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  
  query('status')
    .optional()
    .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
    .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
  
  query('complianceStatus')
    .optional()
    .isIn(['compliant', 'non_compliant', 'requires_attention'])
    .withMessage('Compliance status must be compliant, non_compliant, or requires_attention'),
  
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid date'),
  
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid date'),
  
  query('sortBy')
    .optional()
    .isIn(['completedDate', 'overallComplianceScore', 'inspector', 'assetName'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
]; 