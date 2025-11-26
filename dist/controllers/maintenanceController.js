"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceController = void 0;
const express_validator_1 = require("express-validator");
const MaintenanceSchedule_1 = __importDefault(require("../models/MaintenanceSchedule"));
const MaintenanceRecord_1 = __importDefault(require("../models/MaintenanceRecord"));
class MaintenanceController {
    static async getAllSchedules(req, res) {
        try {
            const { page = 1, limit = 10, search, status, priority, frequency, assignedTechnician, department, sortBy = 'nextDueDate', sortOrder = 'asc' } = req.query;
            const query = {};
            if (status && status !== 'all') {
                if (status === 'overdue') {
                    query.$or = [
                        { status: 'overdue' },
                        { status: 'active', nextDueDate: { $lt: new Date() } }
                    ];
                }
                else {
                    query.status = status;
                }
            }
            if (priority && priority !== 'all') {
                query.priority = priority;
            }
            if (frequency && frequency !== 'all') {
                query.frequency = frequency;
            }
            if (assignedTechnician) {
                query.assignedTechnician = { $regex: assignedTechnician, $options: 'i' };
            }
            if (department && department !== 'all') {
                query.$and = query.$and || [];
                query.$and.push({
                    $or: [
                        { department: { $regex: department, $options: 'i' } },
                        { assignedDepartment: { $regex: department, $options: 'i' } },
                        {
                            $and: [
                                { isOpenTicket: true },
                                { assignedDepartment: { $regex: department, $options: 'i' } }
                            ]
                        }
                    ]
                });
            }
            if (search) {
                query.$and = query.$and || [];
                query.$and.push({
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { assetName: { $regex: search, $options: 'i' } },
                        { assetTag: { $regex: search, $options: 'i' } },
                        { location: { $regex: search, $options: 'i' } },
                        { assignedTechnician: { $regex: search, $options: 'i' } }
                    ]
                });
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            const [schedules, totalCount] = await Promise.all([
                MaintenanceSchedule_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                MaintenanceSchedule_1.default.countDocuments(query)
            ]);
            const now = new Date();
            const transformedSchedules = schedules.map(schedule => {
                if (schedule.status === 'active' && new Date(schedule.nextDueDate) < now) {
                    schedule.status = 'overdue';
                }
                return {
                    id: schedule._id.toString(),
                    ...schedule,
                    _id: undefined,
                    __v: undefined
                };
            });
            res.status(200).json({
                success: true,
                data: {
                    schedules: transformedSchedules,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Maintenance schedules retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching maintenance schedules:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching maintenance schedules',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getScheduleById(req, res) {
        try {
            const { id } = req.params;
            const schedule = await MaintenanceSchedule_1.default.findById(id).lean();
            if (!schedule) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance schedule not found'
                });
                return;
            }
            const now = new Date();
            if (schedule.status === 'active' && new Date(schedule.nextDueDate) < now) {
                schedule.status = 'overdue';
            }
            const transformedSchedule = {
                id: schedule._id.toString(),
                ...schedule,
                _id: undefined,
                __v: undefined
            };
            res.status(200).json({
                success: true,
                data: transformedSchedule,
                message: 'Maintenance schedule retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching maintenance schedule:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching maintenance schedule',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async createSchedule(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const scheduleData = req.body;
            const nextDueDate = MaintenanceController.calculateNextDueDate(scheduleData.frequency, scheduleData.startDate, scheduleData.customFrequencyDays);
            const schedule = new MaintenanceSchedule_1.default({
                ...scheduleData,
                nextDueDate
            });
            const savedSchedule = await schedule.save();
            res.status(201).json({
                success: true,
                data: savedSchedule.toJSON(),
                message: 'Maintenance schedule created successfully'
            });
        }
        catch (error) {
            console.error('Error creating maintenance schedule:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating maintenance schedule',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateSchedule(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const { id } = req.params;
            const updates = req.body;
            if (updates.frequency || updates.startDate || updates.customFrequencyDays) {
                const schedule = await MaintenanceSchedule_1.default.findById(id);
                if (schedule) {
                    updates.nextDueDate = MaintenanceController.calculateNextDueDate(updates.frequency || schedule.frequency, updates.startDate || schedule.startDate, updates.customFrequencyDays || schedule.customFrequencyDays);
                }
            }
            const updatedSchedule = await MaintenanceSchedule_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
            if (!updatedSchedule) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance schedule not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: updatedSchedule.toJSON(),
                message: 'Maintenance schedule updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating maintenance schedule:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating maintenance schedule',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteSchedule(req, res) {
        try {
            const { id } = req.params;
            const deletedSchedule = await MaintenanceSchedule_1.default.findByIdAndDelete(id);
            if (!deletedSchedule) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance schedule not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Maintenance schedule deleted successfully',
                data: {
                    id: deletedSchedule._id.toString(),
                    title: deletedSchedule.title
                }
            });
        }
        catch (error) {
            console.error('Error deleting maintenance schedule:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting maintenance schedule',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getAllRecords(req, res) {
        try {
            const { page = 1, limit = 10, search, status, technician, verified, department, sortBy = 'completedDate', sortOrder = 'desc' } = req.query;
            const query = {};
            if (status && status !== 'all') {
                if (status === 'verified') {
                    query.adminVerified = true;
                }
                else if (status === 'pending') {
                    query.adminVerified = false;
                }
                else {
                    query.status = status;
                }
            }
            if (verified !== undefined) {
                query.adminVerified = verified === 'true';
            }
            if (technician) {
                query.technician = { $regex: technician, $options: 'i' };
            }
            if (department && department !== 'all') {
                query.$and = query.$and || [];
                query.$and.push({
                    $or: [
                        { department: { $regex: department, $options: 'i' } },
                        { assignedDepartment: { $regex: department, $options: 'i' } },
                        {
                            $and: [
                                { isOpenTicket: true },
                                { assignedDepartment: { $regex: department, $options: 'i' } }
                            ]
                        }
                    ]
                });
            }
            if (search) {
                query.$and = query.$and || [];
                query.$and.push({
                    $or: [
                        { assetName: { $regex: search, $options: 'i' } },
                        { technician: { $regex: search, $options: 'i' } },
                        { notes: { $regex: search, $options: 'i' } }
                    ]
                });
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            const [records, totalCount] = await Promise.all([
                MaintenanceRecord_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                MaintenanceRecord_1.default.countDocuments(query)
            ]);
            const transformedRecords = records.map(record => ({
                id: record._id.toString(),
                ...record,
                _id: undefined,
                __v: undefined
            }));
            res.status(200).json({
                success: true,
                data: {
                    records: transformedRecords,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Maintenance records retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching maintenance records:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching maintenance records',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getRecordById(req, res) {
        try {
            const { id } = req.params;
            const record = await MaintenanceRecord_1.default.findById(id).lean();
            if (!record) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance record not found'
                });
                return;
            }
            const transformedRecord = {
                id: record._id.toString(),
                ...record,
                _id: undefined,
                __v: undefined
            };
            res.status(200).json({
                success: true,
                data: transformedRecord,
                message: 'Maintenance record retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching maintenance record:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching maintenance record',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async createRecord(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const recordData = req.body;
            const record = new MaintenanceRecord_1.default(recordData);
            const savedRecord = await record.save();
            if (recordData.scheduleId) {
                const schedule = await MaintenanceSchedule_1.default.findById(recordData.scheduleId);
                if (schedule) {
                    schedule.lastCompletedDate = new Date(recordData.completedDate);
                    schedule.nextDueDate = MaintenanceController.calculateNextDueDate(schedule.frequency, recordData.completedDate, schedule.customFrequencyDays);
                    await schedule.save();
                }
            }
            res.status(201).json({
                success: true,
                data: savedRecord.toJSON(),
                message: 'Maintenance record created successfully'
            });
        }
        catch (error) {
            console.error('Error creating maintenance record:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating maintenance record',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateRecord(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const { id } = req.params;
            const updates = req.body;
            const updatedRecord = await MaintenanceRecord_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
            if (!updatedRecord) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance record not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: updatedRecord.toJSON(),
                message: 'Maintenance record updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating maintenance record:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating maintenance record',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async verifyRecord(req, res) {
        try {
            const { id } = req.params;
            const { adminNotes, adminVerifiedBy } = req.body;
            const updatedRecord = await MaintenanceRecord_1.default.findByIdAndUpdate(id, {
                $set: {
                    adminVerified: true,
                    adminVerifiedBy: adminVerifiedBy || 'Admin',
                    adminVerifiedAt: new Date(),
                    adminNotes: adminNotes || ''
                }
            }, { new: true, runValidators: true });
            if (!updatedRecord) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance record not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: updatedRecord.toJSON(),
                message: 'Maintenance record verified successfully'
            });
        }
        catch (error) {
            console.error('Error verifying maintenance record:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while verifying maintenance record',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteRecord(req, res) {
        try {
            const { id } = req.params;
            const deletedRecord = await MaintenanceRecord_1.default.findByIdAndDelete(id);
            if (!deletedRecord) {
                res.status(404).json({
                    success: false,
                    message: 'Maintenance record not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Maintenance record deleted successfully',
                data: {
                    id: deletedRecord._id.toString(),
                    assetName: deletedRecord.assetName
                }
            });
        }
        catch (error) {
            console.error('Error deleting maintenance record:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting maintenance record',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getMaintenanceStats(req, res) {
        try {
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const [scheduleStats, recordStats] = await Promise.all([
                MaintenanceSchedule_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalSchedules: { $sum: 1 },
                            activeSchedules: {
                                $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                            },
                            overdueSchedules: {
                                $sum: {
                                    $cond: [
                                        {
                                            $or: [
                                                { $eq: ['$status', 'overdue'] },
                                                {
                                                    $and: [
                                                        { $eq: ['$status', 'active'] },
                                                        { $lt: ['$nextDueDate', now] }
                                                    ]
                                                }
                                            ]
                                        },
                                        1,
                                        0
                                    ]
                                }
                            },
                            completedSchedules: {
                                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                            }
                        }
                    }
                ]),
                MaintenanceRecord_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalRecords: { $sum: 1 },
                            completedThisMonth: {
                                $sum: {
                                    $cond: [
                                        {
                                            $and: [
                                                { $gte: ['$completedDate', monthStart] },
                                                { $eq: ['$status', 'completed'] }
                                            ]
                                        },
                                        1,
                                        0
                                    ]
                                }
                            },
                            pendingVerification: {
                                $sum: { $cond: [{ $eq: ['$adminVerified', false] }, 1, 0] }
                            },
                            averageCompletionTime: { $avg: '$actualDuration' }
                        }
                    }
                ])
            ]);
            const result = {
                totalSchedules: scheduleStats[0]?.totalSchedules || 0,
                activeSchedules: scheduleStats[0]?.activeSchedules || 0,
                overdueSchedules: scheduleStats[0]?.overdueSchedules || 0,
                completedSchedules: scheduleStats[0]?.completedSchedules || 0,
                totalRecords: recordStats[0]?.totalRecords || 0,
                completedThisMonth: recordStats[0]?.completedThisMonth || 0,
                pendingVerification: recordStats[0]?.pendingVerification || 0,
                averageCompletionTime: recordStats[0]?.averageCompletionTime || 0,
                assetUptime: 95.5
            };
            res.status(200).json({
                success: true,
                data: result,
                message: 'Maintenance statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching maintenance stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching maintenance statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static calculateNextDueDate(frequency, fromDate, customDays) {
        const date = new Date(fromDate);
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
                if (customDays) {
                    date.setDate(date.getDate() + customDays);
                }
                break;
        }
        return date;
    }
}
exports.MaintenanceController = MaintenanceController;
