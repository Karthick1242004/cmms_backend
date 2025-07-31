"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecordQuery = exports.validateScheduleQuery = exports.validateMaintenanceId = exports.validateVerifyRecord = exports.validateUpdateRecord = exports.validateCreateRecord = exports.validateUpdateSchedule = exports.validateCreateSchedule = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateSchedule = [
    (0, express_validator_1.body)('assetId')
        .notEmpty()
        .withMessage('Asset ID is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Asset ID must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('assetName')
        .notEmpty()
        .withMessage('Asset name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Asset name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('assetTag')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Asset tag cannot exceed 50 characters')
        .trim(),
    (0, express_validator_1.body)('assetType')
        .notEmpty()
        .withMessage('Asset type is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Asset type must be between 2 and 50 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('location')
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Maintenance title is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('frequency')
        .notEmpty()
        .withMessage('Frequency is required')
        .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
        .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
    (0, express_validator_1.body)('customFrequencyDays')
        .optional()
        .isInt({ min: 1, max: 3650 })
        .withMessage('Custom frequency must be between 1 and 3650 days')
        .toInt(),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date')
        .toDate(),
    (0, express_validator_1.body)('priority')
        .notEmpty()
        .withMessage('Priority is required')
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be low, medium, high, or critical'),
    (0, express_validator_1.body)('estimatedDuration')
        .notEmpty()
        .withMessage('Estimated duration is required')
        .isFloat({ min: 0.1, max: 168 })
        .withMessage('Estimated duration must be between 0.1 and 168 hours')
        .toFloat(),
    (0, express_validator_1.body)('assignedTechnician')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Assigned technician name cannot exceed 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'completed', 'overdue'])
        .withMessage('Status must be active, inactive, completed, or overdue'),
    (0, express_validator_1.body)('createdBy')
        .notEmpty()
        .withMessage('Created by is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Created by must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('parts')
        .optional()
        .isArray()
        .withMessage('Parts must be an array'),
    (0, express_validator_1.body)('parts.*.partId')
        .if((0, express_validator_1.body)('parts').exists())
        .notEmpty()
        .withMessage('Part ID is required')
        .trim(),
    (0, express_validator_1.body)('parts.*.partName')
        .if((0, express_validator_1.body)('parts').exists())
        .notEmpty()
        .withMessage('Part name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Part name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('parts.*.partSku')
        .if((0, express_validator_1.body)('parts').exists())
        .notEmpty()
        .withMessage('Part SKU is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Part SKU must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('parts.*.estimatedTime')
        .if((0, express_validator_1.body)('parts').exists())
        .notEmpty()
        .withMessage('Estimated time is required')
        .isInt({ min: 1, max: 1440 })
        .withMessage('Estimated time must be between 1 and 1440 minutes')
        .toInt(),
    (0, express_validator_1.body)('parts.*.requiresReplacement')
        .if((0, express_validator_1.body)('parts').exists())
        .optional()
        .isBoolean()
        .withMessage('Requires replacement must be a boolean')
        .toBoolean(),
    (0, express_validator_1.body)('parts.*.replacementFrequency')
        .if((0, express_validator_1.body)('parts').exists())
        .optional()
        .isInt({ min: 1 })
        .withMessage('Replacement frequency must be at least 1')
        .toInt(),
    (0, express_validator_1.body)('parts.*.checklistItems')
        .if((0, express_validator_1.body)('parts').exists())
        .optional()
        .isArray()
        .withMessage('Checklist items must be an array'),
    (0, express_validator_1.body)('parts.*.checklistItems.*.description')
        .if((0, express_validator_1.body)('parts.*.checklistItems').exists())
        .notEmpty()
        .withMessage('Checklist item description is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Description must be between 5 and 200 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('parts.*.checklistItems.*.isRequired')
        .if((0, express_validator_1.body)('parts.*.checklistItems').exists())
        .optional()
        .isBoolean()
        .withMessage('Is required must be a boolean')
        .toBoolean(),
    (0, express_validator_1.body)('parts.*.checklistItems.*.notes')
        .if((0, express_validator_1.body)('parts.*.checklistItems').exists())
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters')
        .trim()
        .escape(),
];
exports.validateUpdateSchedule = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid maintenance schedule ID format'),
    (0, express_validator_1.body)('assetId')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Asset ID must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('assetName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Asset name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('assetTag')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Asset tag cannot exceed 50 characters')
        .trim(),
    (0, express_validator_1.body)('assetType')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Asset type must be between 2 and 50 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('location')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('frequency')
        .optional()
        .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'])
        .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, or custom'),
    (0, express_validator_1.body)('customFrequencyDays')
        .optional()
        .isInt({ min: 1, max: 3650 })
        .withMessage('Custom frequency must be between 1 and 3650 days')
        .toInt(),
    (0, express_validator_1.body)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date')
        .toDate(),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be low, medium, high, or critical'),
    (0, express_validator_1.body)('estimatedDuration')
        .optional()
        .isFloat({ min: 0.1, max: 168 })
        .withMessage('Estimated duration must be between 0.1 and 168 hours')
        .toFloat(),
    (0, express_validator_1.body)('assignedTechnician')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Assigned technician name cannot exceed 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'completed', 'overdue'])
        .withMessage('Status must be active, inactive, completed, or overdue'),
];
exports.validateCreateRecord = [
    (0, express_validator_1.body)('scheduleId')
        .notEmpty()
        .withMessage('Schedule ID is required')
        .isMongoId()
        .withMessage('Invalid schedule ID format'),
    (0, express_validator_1.body)('assetId')
        .notEmpty()
        .withMessage('Asset ID is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Asset ID must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('assetName')
        .notEmpty()
        .withMessage('Asset name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Asset name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('completedDate')
        .notEmpty()
        .withMessage('Completed date is required')
        .isISO8601()
        .withMessage('Completed date must be a valid ISO 8601 date')
        .toDate(),
    (0, express_validator_1.body)('startTime')
        .notEmpty()
        .withMessage('Start time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format')
        .trim(),
    (0, express_validator_1.body)('endTime')
        .notEmpty()
        .withMessage('End time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format')
        .trim(),
    (0, express_validator_1.body)('actualDuration')
        .notEmpty()
        .withMessage('Actual duration is required')
        .isFloat({ min: 0, max: 168 })
        .withMessage('Actual duration must be between 0 and 168 hours')
        .toFloat(),
    (0, express_validator_1.body)('technician')
        .notEmpty()
        .withMessage('Technician name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Technician name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('technicianId')
        .notEmpty()
        .withMessage('Technician ID is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Technician ID must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
        .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
    (0, express_validator_1.body)('overallCondition')
        .notEmpty()
        .withMessage('Overall condition is required')
        .isIn(['excellent', 'good', 'fair', 'poor'])
        .withMessage('Overall condition must be excellent, good, fair, or poor'),
    (0, express_validator_1.body)('notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Notes cannot exceed 2000 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('partsStatus')
        .optional()
        .isArray()
        .withMessage('Parts status must be an array'),
    (0, express_validator_1.body)('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
    (0, express_validator_1.body)('adminVerified')
        .optional()
        .isBoolean()
        .withMessage('Admin verified must be a boolean')
        .toBoolean(),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Admin notes cannot exceed 1000 characters')
        .trim()
        .escape(),
];
exports.validateUpdateRecord = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid maintenance record ID format'),
    (0, express_validator_1.body)('completedDate')
        .optional()
        .isISO8601()
        .withMessage('Completed date must be a valid ISO 8601 date')
        .toDate(),
    (0, express_validator_1.body)('startTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format')
        .trim(),
    (0, express_validator_1.body)('endTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format')
        .trim(),
    (0, express_validator_1.body)('actualDuration')
        .optional()
        .isFloat({ min: 0, max: 168 })
        .withMessage('Actual duration must be between 0 and 168 hours')
        .toFloat(),
    (0, express_validator_1.body)('technician')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Technician name must be between 2 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['completed', 'partially_completed', 'failed', 'in_progress'])
        .withMessage('Status must be completed, partially_completed, failed, or in_progress'),
    (0, express_validator_1.body)('overallCondition')
        .optional()
        .isIn(['excellent', 'good', 'fair', 'poor'])
        .withMessage('Overall condition must be excellent, good, fair, or poor'),
    (0, express_validator_1.body)('notes')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Notes cannot exceed 2000 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('adminVerified')
        .optional()
        .isBoolean()
        .withMessage('Admin verified must be a boolean')
        .toBoolean(),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Admin notes cannot exceed 1000 characters')
        .trim()
        .escape(),
];
exports.validateVerifyRecord = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid maintenance record ID format'),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Admin notes cannot exceed 1000 characters')
        .trim()
        .escape(),
    (0, express_validator_1.body)('adminVerifiedBy')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Admin verified by must be between 2 and 100 characters')
        .trim()
        .escape(),
];
exports.validateMaintenanceId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid maintenance ID format')
];
exports.validateScheduleQuery = [
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
        .isIn(['active', 'inactive', 'completed', 'overdue', 'all'])
        .withMessage('Status must be active, inactive, completed, overdue, or all'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical', 'all'])
        .withMessage('Priority must be low, medium, high, critical, or all'),
    (0, express_validator_1.query)('frequency')
        .optional()
        .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom', 'all'])
        .withMessage('Frequency must be daily, weekly, monthly, quarterly, annually, custom, or all'),
    (0, express_validator_1.query)('assignedTechnician')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Assigned technician must be between 1 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['title', 'assetName', 'location', 'priority', 'frequency', 'nextDueDate', 'createdAt', 'updatedAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
];
exports.validateRecordQuery = [
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
        .isIn(['completed', 'partially_completed', 'failed', 'in_progress', 'verified', 'pending', 'all'])
        .withMessage('Status must be completed, partially_completed, failed, in_progress, verified, pending, or all'),
    (0, express_validator_1.query)('technician')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Technician must be between 1 and 100 characters')
        .trim()
        .escape(),
    (0, express_validator_1.query)('verified')
        .optional()
        .isBoolean()
        .withMessage('Verified must be a boolean')
        .toBoolean(),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['assetName', 'technician', 'completedDate', 'status', 'overallCondition', 'adminVerified', 'createdAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
];
