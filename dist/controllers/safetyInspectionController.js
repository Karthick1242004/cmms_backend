"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySafetyInspectionRecord = exports.updateSafetyInspectionRecord = exports.createSafetyInspectionRecord = exports.getSafetyInspectionRecords = exports.getSafetyInspectionStats = exports.deleteSafetyInspectionSchedule = exports.updateSafetyInspectionSchedule = exports.createSafetyInspectionSchedule = exports.getSafetyInspectionScheduleById = exports.getSafetyInspectionSchedules = void 0;
const express_validator_1 = require("express-validator");
const SafetyInspectionSchedule_1 = __importDefault(require("../models/SafetyInspectionSchedule"));
const SafetyInspectionRecord_1 = __importDefault(require("../models/SafetyInspectionRecord"));
// Helper function to calculate next due date
const calculateNextDueDate = (frequency, startDate, customDays) => {
    const date = new Date(startDate);
    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'quarterly':
            date.setMonth(date.getMonth() + 3);
            break;
        case 'annually':
            date.setFullYear(date.getFullYear() + 1);
            break;
        case 'custom':
            date.setDate(date.getDate() + (customDays || 30));
            break;
    }
    return date;
};
// Safety Inspection Schedule Controllers
const getSafetyInspectionSchedules = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, priority, riskLevel, frequency, assignedInspector, safetyStandard, sortBy = 'nextDueDate', sortOrder = 'asc' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { assetName: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { assignedInspector: { $regex: search, $options: 'i' } }
            ];
        }
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (riskLevel)
            filter.riskLevel = riskLevel;
        if (frequency)
            filter.frequency = frequency;
        if (assignedInspector)
            filter.assignedInspector = { $regex: assignedInspector, $options: 'i' };
        if (safetyStandard)
            filter.safetyStandards = { $in: [safetyStandard] };
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const [schedules, totalCount] = await Promise.all([
            SafetyInspectionSchedule_1.default.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            SafetyInspectionSchedule_1.default.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasNext = pageNum < totalPages;
        const hasPrevious = pageNum > 1;
        return res.status(200).json({
            success: true,
            data: {
                schedules,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    hasNext,
                    hasPrevious
                }
            },
            message: 'Safety inspection schedules retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching safety inspection schedules:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch safety inspection schedules',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getSafetyInspectionSchedules = getSafetyInspectionSchedules;
const getSafetyInspectionScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await SafetyInspectionSchedule_1.default.findById(id);
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Safety inspection schedule not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: schedule,
            message: 'Safety inspection schedule retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching safety inspection schedule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch safety inspection schedule',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getSafetyInspectionScheduleById = getSafetyInspectionScheduleById;
const createSafetyInspectionSchedule = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const scheduleData = req.body;
        // Calculate next due date
        scheduleData.nextDueDate = calculateNextDueDate(scheduleData.frequency, new Date(scheduleData.startDate), scheduleData.customFrequencyDays);
        const schedule = new SafetyInspectionSchedule_1.default(scheduleData);
        await schedule.save();
        return res.status(201).json({
            success: true,
            data: schedule,
            message: 'Safety inspection schedule created successfully'
        });
    }
    catch (error) {
        console.error('Error creating safety inspection schedule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create safety inspection schedule',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createSafetyInspectionSchedule = createSafetyInspectionSchedule;
const updateSafetyInspectionSchedule = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const updates = req.body;
        // Recalculate next due date if frequency or start date changed
        if (updates.frequency || updates.startDate || updates.customFrequencyDays) {
            const schedule = await SafetyInspectionSchedule_1.default.findById(id);
            if (schedule) {
                updates.nextDueDate = calculateNextDueDate(updates.frequency || schedule.frequency, new Date(updates.startDate || schedule.startDate), updates.customFrequencyDays || schedule.customFrequencyDays);
            }
        }
        const schedule = await SafetyInspectionSchedule_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Safety inspection schedule not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: schedule,
            message: 'Safety inspection schedule updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating safety inspection schedule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update safety inspection schedule',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateSafetyInspectionSchedule = updateSafetyInspectionSchedule;
const deleteSafetyInspectionSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await SafetyInspectionSchedule_1.default.findByIdAndDelete(id);
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Safety inspection schedule not found'
            });
        }
        // Also delete associated records
        await SafetyInspectionRecord_1.default.deleteMany({ scheduleId: id });
        return res.status(200).json({
            success: true,
            message: 'Safety inspection schedule and associated records deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting safety inspection schedule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete safety inspection schedule',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteSafetyInspectionSchedule = deleteSafetyInspectionSchedule;
const getSafetyInspectionStats = async (req, res) => {
    try {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalSchedules, activeSchedules, overdueSchedules, completedThisMonth, pendingVerification, recentRecords, openViolations, criticalViolations] = await Promise.all([
            SafetyInspectionSchedule_1.default.countDocuments(),
            SafetyInspectionSchedule_1.default.countDocuments({ status: 'active' }),
            SafetyInspectionSchedule_1.default.countDocuments({ status: 'overdue' }),
            SafetyInspectionRecord_1.default.countDocuments({
                completedDate: { $gte: thisMonth },
                status: 'completed'
            }),
            SafetyInspectionRecord_1.default.countDocuments({
                status: 'completed',
                adminVerified: false
            }),
            SafetyInspectionRecord_1.default.find({
                status: 'completed',
                completedDate: { $gte: thisMonth }
            }).select('overallComplianceScore actualDuration complianceStatus'),
            SafetyInspectionRecord_1.default.aggregate([
                { $unwind: '$violations' },
                { $match: { 'violations.status': { $in: ['open', 'in_progress'] } } },
                { $count: 'total' }
            ]),
            SafetyInspectionRecord_1.default.aggregate([
                { $unwind: '$violations' },
                { $match: {
                        'violations.status': { $in: ['open', 'in_progress'] },
                        'violations.riskLevel': 'critical'
                    } },
                { $count: 'total' }
            ])
        ]);
        // Calculate compliance metrics
        const averageComplianceScore = recentRecords.length > 0
            ? Math.round(recentRecords.reduce((sum, record) => sum + record.overallComplianceScore, 0) / recentRecords.length)
            : 0;
        const averageInspectionTime = recentRecords.length > 0
            ? Math.round((recentRecords.reduce((sum, record) => sum + record.actualDuration, 0) / recentRecords.length) * 10) / 10
            : 0;
        const complianceRate = recentRecords.length > 0
            ? Math.round((recentRecords.filter(record => record.complianceStatus === 'compliant').length / recentRecords.length) * 100)
            : 0;
        const stats = {
            totalSchedules,
            activeSchedules,
            overdueSchedules,
            completedThisMonth,
            pendingVerification,
            averageComplianceScore,
            openViolations: openViolations[0]?.total || 0,
            criticalViolations: criticalViolations[0]?.total || 0,
            averageInspectionTime,
            complianceRate
        };
        return res.status(200).json({
            success: true,
            data: stats,
            message: 'Safety inspection statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching safety inspection stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch safety inspection statistics',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getSafetyInspectionStats = getSafetyInspectionStats;
// Safety Inspection Record Controllers
const getSafetyInspectionRecords = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, complianceStatus, inspector, dateFrom, dateTo, sortBy = 'completedDate', sortOrder = 'desc' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { assetName: { $regex: search, $options: 'i' } },
                { inspector: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }
        if (status)
            filter.status = status;
        if (complianceStatus)
            filter.complianceStatus = complianceStatus;
        if (inspector)
            filter.inspector = { $regex: inspector, $options: 'i' };
        if (dateFrom || dateTo) {
            filter.completedDate = {};
            if (dateFrom)
                filter.completedDate.$gte = new Date(dateFrom);
            if (dateTo)
                filter.completedDate.$lte = new Date(dateTo);
        }
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const [records, totalCount] = await Promise.all([
            SafetyInspectionRecord_1.default.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            SafetyInspectionRecord_1.default.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasNext = pageNum < totalPages;
        const hasPrevious = pageNum > 1;
        return res.status(200).json({
            success: true,
            data: {
                records,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    hasNext,
                    hasPrevious
                }
            },
            message: 'Safety inspection records retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching safety inspection records:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch safety inspection records',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getSafetyInspectionRecords = getSafetyInspectionRecords;
const createSafetyInspectionRecord = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const record = new SafetyInspectionRecord_1.default(req.body);
        await record.save();
        // Update the schedule's last completed date
        await SafetyInspectionSchedule_1.default.findByIdAndUpdate(record.scheduleId, { lastCompletedDate: record.completedDate });
        return res.status(201).json({
            success: true,
            data: record,
            message: 'Safety inspection record created successfully'
        });
    }
    catch (error) {
        console.error('Error creating safety inspection record:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create safety inspection record',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createSafetyInspectionRecord = createSafetyInspectionRecord;
const updateSafetyInspectionRecord = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const record = await SafetyInspectionRecord_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Safety inspection record not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: record,
            message: 'Safety inspection record updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating safety inspection record:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update safety inspection record',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateSafetyInspectionRecord = updateSafetyInspectionRecord;
const verifySafetyInspectionRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes, adminVerifiedBy } = req.body;
        const record = await SafetyInspectionRecord_1.default.findByIdAndUpdate(id, {
            adminVerified: true,
            adminVerifiedBy,
            adminVerifiedAt: new Date(),
            adminNotes
        }, { new: true, runValidators: true });
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Safety inspection record not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: record,
            message: 'Safety inspection record verified successfully'
        });
    }
    catch (error) {
        console.error('Error verifying safety inspection record:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify safety inspection record',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.verifySafetyInspectionRecord = verifySafetyInspectionRecord;
//# sourceMappingURL=safetyInspectionController.js.map