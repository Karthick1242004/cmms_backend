"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateStatus = exports.validateQueryDailyLogActivities = exports.validateGetDailyLogActivity = exports.validateUpdateDailyLogActivity = exports.validateCreateDailyLogActivity = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
exports.validateCreateDailyLogActivity = [
    (0, express_validator_1.body)('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO date'),
    (0, express_validator_1.body)('time')
        .notEmpty()
        .withMessage('Time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Time must be in HH:MM format'),
    (0, express_validator_1.body)('area')
        .notEmpty()
        .withMessage('Area is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Area must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('departmentId')
        .notEmpty()
        .withMessage('Department ID is required')
        .isLength({ min: 1 })
        .withMessage('Department ID cannot be empty'),
    (0, express_validator_1.body)('departmentName')
        .notEmpty()
        .withMessage('Department name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Department name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('assetId')
        .notEmpty()
        .withMessage('Asset ID is required')
        .isLength({ min: 1 })
        .withMessage('Asset ID cannot be empty'),
    (0, express_validator_1.body)('assetName')
        .notEmpty()
        .withMessage('Asset name is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Asset name must be between 2 and 200 characters')
        .trim(),
    (0, express_validator_1.body)('natureOfProblem')
        .notEmpty()
        .withMessage('Nature of problem is required')
        .isLength({ min: 5, max: 500 })
        .withMessage('Nature of problem must be between 5 and 500 characters')
        .trim(),
    (0, express_validator_1.body)('commentsOrSolution')
        .notEmpty()
        .withMessage('Comments or solution is required')
        .isLength({ min: 5, max: 1000 })
        .withMessage('Comments or solution must be between 5 and 1000 characters')
        .trim(),
    (0, express_validator_1.body)('attendedBy')
        .notEmpty()
        .withMessage('Attended by is required')
        .isLength({ min: 1 })
        .withMessage('Attended by cannot be empty'),
    (0, express_validator_1.body)('attendedByName')
        .notEmpty()
        .withMessage('Attended by name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Attended by name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('verifiedBy')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Verified by cannot be empty if provided'),
    (0, express_validator_1.body)('verifiedByName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Verified by name must be between 2 and 100 characters if provided')
        .trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['open', 'in-progress', 'resolved', 'verified'])
        .withMessage('Status must be one of: open, in-progress, resolved, verified'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be one of: low, medium, high, critical'),
    handleValidationErrors
];
exports.validateUpdateDailyLogActivity = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Daily log activity ID is required')
        .isLength({ min: 1 })
        .withMessage('Invalid daily log activity ID'),
    (0, express_validator_1.body)('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO date'),
    (0, express_validator_1.body)('time')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Time must be in HH:MM format'),
    (0, express_validator_1.body)('area')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Area must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('departmentId')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Department ID cannot be empty'),
    (0, express_validator_1.body)('departmentName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Department name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('assetId')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Asset ID cannot be empty'),
    (0, express_validator_1.body)('assetName')
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage('Asset name must be between 2 and 200 characters')
        .trim(),
    (0, express_validator_1.body)('natureOfProblem')
        .optional()
        .isLength({ min: 5, max: 500 })
        .withMessage('Nature of problem must be between 5 and 500 characters')
        .trim(),
    (0, express_validator_1.body)('commentsOrSolution')
        .optional()
        .isLength({ min: 5, max: 1000 })
        .withMessage('Comments or solution must be between 5 and 1000 characters')
        .trim(),
    (0, express_validator_1.body)('attendedBy')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Attended by cannot be empty'),
    (0, express_validator_1.body)('attendedByName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Attended by name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('verifiedBy')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Verified by cannot be empty if provided'),
    (0, express_validator_1.body)('verifiedByName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Verified by name must be between 2 and 100 characters if provided')
        .trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['open', 'in-progress', 'resolved', 'verified'])
        .withMessage('Status must be one of: open, in-progress, resolved, verified'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be one of: low, medium, high, critical'),
    handleValidationErrors
];
exports.validateGetDailyLogActivity = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Daily log activity ID is required')
        .isLength({ min: 1 })
        .withMessage('Invalid daily log activity ID'),
    handleValidationErrors
];
exports.validateQueryDailyLogActivities = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('department')
        .optional()
        .trim(),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['open', 'in-progress', 'resolved', 'verified'])
        .withMessage('Status must be one of: open, in-progress, resolved, verified'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be one of: low, medium, high, critical'),
    (0, express_validator_1.query)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date'),
    (0, express_validator_1.query)('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO date'),
    (0, express_validator_1.query)('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
        .trim(),
    handleValidationErrors
];
exports.validateUpdateStatus = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Daily log activity ID is required')
        .isLength({ min: 1 })
        .withMessage('Invalid daily log activity ID'),
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['open', 'in-progress', 'resolved', 'verified'])
        .withMessage('Status must be one of: open, in-progress, resolved, verified'),
    (0, express_validator_1.body)('verifiedBy')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Verified by cannot be empty if provided'),
    (0, express_validator_1.body)('verifiedByName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Verified by name must be between 2 and 100 characters if provided')
        .trim(),
    handleValidationErrors
];
