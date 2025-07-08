"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecordQuery = exports.validateScheduleQuery = exports.validateIdParam = exports.validateVerifySafetyInspectionRecord = exports.validateUpdateSafetyInspectionRecord = exports.validateCreateSafetyInspectionRecord = exports.validateUpdateSafetyInspectionSchedule = exports.validateCreateSafetyInspectionSchedule = void 0;
const express_validator_1 = require("express-validator");
// Schedule validation
exports.validateCreateSafetyInspectionSchedule = [
    (0, express_validator_1.body)('assetId')
        .trim()
        .notEmpty()
        .withMessage('Asset ID is required')
        .isLength({ max: 50 })
        .withMessage('Asset ID cannot exceed 50 characters'),
    (0, express_validator_1.body)('assetName')
        .trim()
        .notEmpty()
        .withMessage('Asset name is required')
        .isLength({ max: 100 })
        .withMessage('Asset name cannot exceed 100 characters'),
    (0, express_validator_1.body)('assetTag')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Asset tag cannot exceed 50 characters'),
    (0, express_validator_1.body)('assetType')
        .trim()
        .notEmpty()
        .withMessage('Asset type is required')
        .isLength({ max: 50 })
        .withMessage('Asset type cannot exceed 50 characters'),
    (0, express_validator_1.body)('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 100 })
        .withMessage('Location cannot exceed 100 characters'),
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Inspection title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    (0, express_validator_1.body)('frequency')
        .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
        .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
    (0, express_validator_1.body)('customFrequencyDays')
        .optional()
        .isInt({ min: 1, max: 3650 })
        .withMessage('Custom frequency must be between 1 and 3650 days'),
    (0, express_validator_1.body)('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    (0, express_validator_1.body)('priority')
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be low, medium, high, or critical'),
    (0, express_validator_1.body)('riskLevel')
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Risk level must be low, medium, high, or critical'),
    (0, express_validator_1.body)('estimatedDuration')
        .isFloat({ min: 0.1, max: 168 })
        .withMessage('Estimated duration must be between 0.1 and 168 hours'),
    (0, express_validator_1.body)('assignedInspector')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Assigned inspector cannot exceed 100 characters'),
    (0, express_validator_1.body)('safetyStandards')
        .isArray()
        .withMessage('Safety standards must be an array'),
    (0, express_validator_1.body)('safetyStandards.*')
        .trim()
        .isLength({ max: 50 })
        .withMessage('Each safety standard cannot exceed 50 characters'),
    (0, express_validator_1.body)('createdBy')
        .trim()
        .notEmpty()
        .withMessage('Created by is required')
        .isLength({ max: 100 })
        .withMessage('Created by cannot exceed 100 characters'),
    (0, express_validator_1.body)('checklistCategories')
        .isArray({ min: 1 })
        .withMessage('At least one checklist category is required'),
    (0, express_validator_1.body)('checklistCategories.*.categoryName')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ max: 100 })
        .withMessage('Category name cannot exceed 100 characters'),
    (0, express_validator_1.body)('checklistCategories.*.description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Category description cannot exceed 500 characters'),
    (0, express_validator_1.body)('checklistCategories.*.weight')
        .isInt({ min: 1, max: 100 })
        .withMessage('Category weight must be between 1 and 100'),
    (0, express_validator_1.body)('checklistCategories.*.checklistItems')
        .isArray({ min: 1 })
        .withMessage('Each category must have at least one checklist item'),
    (0, express_validator_1.body)('checklistCategories.*.checklistItems.*.description')
        .trim()
        .notEmpty()
        .withMessage('Checklist item description is required')
        .isLength({ max: 200 })
        .withMessage('Checklist item description cannot exceed 200 characters'),
    (0, express_validator_1.body)('checklistCategories.*.checklistItems.*.safetyStandard')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Safety standard cannot exceed 100 characters'),
    (0, express_validator_1.body)('checklistCategories.*.checklistItems.*.riskLevel')
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Risk level must be low, medium, high, or critical'),
];
exports.validateUpdateSafetyInspectionSchedule = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid schedule ID'),
    (0, express_validator_1.body)('assetId')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Asset ID cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Asset ID cannot exceed 50 characters'),
    (0, express_validator_1.body)('assetName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Asset name cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Asset name cannot exceed 100 characters'),
    (0, express_validator_1.body)('assetTag')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Asset tag cannot exceed 50 characters'),
    (0, express_validator_1.body)('assetType')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Asset type cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Asset type cannot exceed 50 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Location cannot exceed 100 characters'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    (0, express_validator_1.body)('frequency')
        .optional()
        .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
        .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be low, medium, high, or critical'),
    (0, express_validator_1.body)('riskLevel')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Risk level must be low, medium, high, or critical'),
    (0, express_validator_1.body)('estimatedDuration')
        .optional()
        .isFloat({ min: 0.1, max: 168 })
        .withMessage('Estimated duration must be between 0.1 and 168 hours'),
];
// Record validation
exports.validateCreateSafetyInspectionRecord = [
    (0, express_validator_1.body)('scheduleId')
        .trim()
        .notEmpty()
        .withMessage('Schedule ID is required'),
    (0, express_validator_1.body)('assetId')
        .trim()
        .notEmpty()
        .withMessage('Asset ID is required'),
    (0, express_validator_1.body)('assetName')
        .trim()
        .notEmpty()
        .withMessage('Asset name is required')
        .isLength({ max: 100 })
        .withMessage('Asset name cannot exceed 100 characters'),
    (0, express_validator_1.body)('completedDate')
        .isISO8601()
        .withMessage('Completed date must be a valid date'),
    (0, express_validator_1.body)('startTime')
        .trim()
        .notEmpty()
        .withMessage('Start time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),
    (0, express_validator_1.body)('endTime')
        .trim()
        .notEmpty()
        .withMessage('End time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),
    (0, express_validator_1.body)('actualDuration')
        .isFloat({ min: 0, max: 168 })
        .withMessage('Actual duration must be between 0 and 168 hours'),
    (0, express_validator_1.body)('inspector')
        .trim()
        .notEmpty()
        .withMessage('Inspector is required')
        .isLength({ max: 100 })
        .withMessage('Inspector name cannot exceed 100 characters'),
    (0, express_validator_1.body)('inspectorId')
        .trim()
        .notEmpty()
        .withMessage('Inspector ID is required'),
    (0, express_validator_1.body)('status')
        .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
        .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
    (0, express_validator_1.body)('overallComplianceScore')
        .isInt({ min: 0, max: 100 })
        .withMessage('Overall compliance score must be between 0 and 100'),
    (0, express_validator_1.body)('complianceStatus')
        .isIn(['compliant', 'non_compliant', 'requires_attention'])
        .withMessage('Compliance status must be compliant, non_compliant, or requires_attention'),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes cannot exceed 1000 characters'),
    (0, express_validator_1.body)('categoryResults')
        .isArray()
        .withMessage('Category results must be an array'),
    (0, express_validator_1.body)('violations')
        .optional()
        .isArray()
        .withMessage('Violations must be an array'),
];
exports.validateUpdateSafetyInspectionRecord = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid record ID'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
        .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
    (0, express_validator_1.body)('overallComplianceScore')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Overall compliance score must be between 0 and 100'),
    (0, express_validator_1.body)('complianceStatus')
        .optional()
        .isIn(['compliant', 'non_compliant', 'requires_attention'])
        .withMessage('Compliance status must be compliant, non_compliant, or requires_attention'),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes cannot exceed 1000 characters'),
];
exports.validateVerifySafetyInspectionRecord = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid record ID'),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Admin notes cannot exceed 1000 characters'),
    (0, express_validator_1.body)('adminVerifiedBy')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Admin verified by cannot exceed 100 characters'),
];
// Common parameter validation
exports.validateIdParam = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
];
// Query parameter validation
exports.validateScheduleQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search term cannot exceed 100 characters'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['active', 'inactive', 'completed', 'overdue'])
        .withMessage('Status must be active, inactive, completed, or overdue'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be low, medium, high, or critical'),
    (0, express_validator_1.query)('riskLevel')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Risk level must be low, medium, high, or critical'),
    (0, express_validator_1.query)('frequency')
        .optional()
        .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
        .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['nextDueDate', 'priority', 'riskLevel', 'title', 'assetName', 'createdAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
];
exports.validateRecordQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search term cannot exceed 100 characters'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
        .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
    (0, express_validator_1.query)('complianceStatus')
        .optional()
        .isIn(['compliant', 'non_compliant', 'requires_attention'])
        .withMessage('Compliance status must be compliant, non_compliant, or requires_attention'),
    (0, express_validator_1.query)('dateFrom')
        .optional()
        .isISO8601()
        .withMessage('Date from must be a valid date'),
    (0, express_validator_1.query)('dateTo')
        .optional()
        .isISO8601()
        .withMessage('Date to must be a valid date'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['completedDate', 'overallComplianceScore', 'inspector', 'assetName'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
];
//# sourceMappingURL=safetyInspectionValidation.js.map