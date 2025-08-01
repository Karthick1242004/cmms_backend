"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftDetailController = void 0;
const express_validator_1 = require("express-validator");
const ShiftDetail_1 = __importDefault(require("../models/ShiftDetail"));
class ShiftDetailController {
    static async getAllShiftDetails(req, res) {
        try {
            const { page = 1, limit = 10, search, department, shiftType, status, location, sortBy = 'employeeName', sortOrder = 'asc' } = req.query;
            const query = {};
            if (department && department !== 'all') {
                query.department = { $regex: department, $options: 'i' };
            }
            if (shiftType && shiftType !== 'all') {
                query.shiftType = shiftType;
            }
            if (status && status !== 'all') {
                query.status = status;
            }
            if (location && location !== 'all') {
                query.location = { $regex: location, $options: 'i' };
            }
            if (search) {
                query.$or = [
                    { employeeName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } },
                    { supervisor: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } }
                ];
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            const [shiftDetails, totalCount] = await Promise.all([
                ShiftDetail_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                ShiftDetail_1.default.countDocuments(query)
            ]);
            const transformedShiftDetails = shiftDetails.map(shift => ({
                id: shift.employeeId,
                employeeId: shift.employeeId,
                employeeName: shift.employeeName,
                email: shift.email,
                phone: shift.phone,
                department: shift.department,
                role: shift.role,
                shiftType: shift.shiftType,
                shiftStartTime: shift.shiftStartTime,
                shiftEndTime: shift.shiftEndTime,
                workDays: shift.workDays,
                supervisor: shift.supervisor,
                location: shift.location,
                status: shift.status,
                joinDate: shift.joinDate,
                avatar: shift.avatar,
                createdAt: shift.createdAt,
                updatedAt: shift.updatedAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    shiftDetails: transformedShiftDetails,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Shift details retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching shift details:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching shift details',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getShiftDetailById(req, res) {
        try {
            const { id } = req.params;
            const employeeId = Number(id);
            const shiftDetail = await ShiftDetail_1.default.findOne({ employeeId }).lean();
            if (!shiftDetail) {
                res.status(404).json({
                    success: false,
                    message: 'Shift detail not found'
                });
                return;
            }
            const transformedShiftDetail = {
                id: shiftDetail.employeeId,
                employeeId: shiftDetail.employeeId,
                employeeName: shiftDetail.employeeName,
                email: shiftDetail.email,
                phone: shiftDetail.phone,
                department: shiftDetail.department,
                role: shiftDetail.role,
                shiftType: shiftDetail.shiftType,
                shiftStartTime: shiftDetail.shiftStartTime,
                shiftEndTime: shiftDetail.shiftEndTime,
                workDays: shiftDetail.workDays,
                supervisor: shiftDetail.supervisor,
                location: shiftDetail.location,
                status: shiftDetail.status,
                joinDate: shiftDetail.joinDate,
                avatar: shiftDetail.avatar,
                createdAt: shiftDetail.createdAt,
                updatedAt: shiftDetail.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedShiftDetail,
                message: 'Shift detail retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching shift detail:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching shift detail',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async createShiftDetail(req, res) {
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
            const { employeeId, employeeName, email, phone, department, role, shiftType, shiftStartTime, shiftEndTime, workDays = [], supervisor, location, status = 'active', joinDate, avatar } = req.body;
            const existingShiftDetail = await ShiftDetail_1.default.findOne({ employeeId });
            if (existingShiftDetail) {
                res.status(409).json({
                    success: false,
                    message: 'Employee with this ID already exists'
                });
                return;
            }
            const existingEmail = await ShiftDetail_1.default.findOne({
                email: email.toLowerCase()
            });
            if (existingEmail) {
                res.status(409).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
                return;
            }
            const shiftDetail = new ShiftDetail_1.default({
                employeeId,
                employeeName,
                email: email.toLowerCase(),
                phone,
                department,
                role,
                shiftType,
                shiftStartTime,
                shiftEndTime,
                workDays,
                supervisor,
                location,
                status,
                joinDate,
                avatar
            });
            const savedShiftDetail = await shiftDetail.save();
            const transformedShiftDetail = {
                id: savedShiftDetail.employeeId,
                employeeId: savedShiftDetail.employeeId,
                employeeName: savedShiftDetail.employeeName,
                email: savedShiftDetail.email,
                phone: savedShiftDetail.phone,
                department: savedShiftDetail.department,
                role: savedShiftDetail.role,
                shiftType: savedShiftDetail.shiftType,
                shiftStartTime: savedShiftDetail.shiftStartTime,
                shiftEndTime: savedShiftDetail.shiftEndTime,
                workDays: savedShiftDetail.workDays,
                supervisor: savedShiftDetail.supervisor,
                location: savedShiftDetail.location,
                status: savedShiftDetail.status,
                joinDate: savedShiftDetail.joinDate,
                avatar: savedShiftDetail.avatar,
                createdAt: savedShiftDetail.createdAt,
                updatedAt: savedShiftDetail.updatedAt
            };
            res.status(201).json({
                success: true,
                data: transformedShiftDetail,
                message: 'Shift detail created successfully'
            });
        }
        catch (error) {
            console.error('Error creating shift detail:', error);
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                res.status(409).json({
                    success: false,
                    message: `Employee with this ${field} already exists`
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating shift detail',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateShiftDetail(req, res) {
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
            const employeeId = Number(id);
            const updates = req.body;
            const existingShiftDetail = await ShiftDetail_1.default.findOne({ employeeId });
            if (!existingShiftDetail) {
                res.status(404).json({
                    success: false,
                    message: 'Shift detail not found'
                });
                return;
            }
            if (updates.email && updates.email.toLowerCase() !== existingShiftDetail.email) {
                const duplicateEmail = await ShiftDetail_1.default.findOne({
                    email: updates.email.toLowerCase(),
                    employeeId: { $ne: employeeId }
                });
                if (duplicateEmail) {
                    res.status(409).json({
                        success: false,
                        message: 'Employee with this email already exists'
                    });
                    return;
                }
            }
            if (updates.employeeId && updates.employeeId !== existingShiftDetail.employeeId) {
                const duplicateEmployeeId = await ShiftDetail_1.default.findOne({
                    employeeId: updates.employeeId,
                    _id: { $ne: existingShiftDetail._id }
                });
                if (duplicateEmployeeId) {
                    res.status(409).json({
                        success: false,
                        message: 'Employee with this ID already exists'
                    });
                    return;
                }
            }
            if (updates.email) {
                updates.email = updates.email.toLowerCase();
            }
            const updatedShiftDetail = await ShiftDetail_1.default.findOneAndUpdate({ employeeId }, { $set: updates }, { new: true, runValidators: true }).lean();
            if (!updatedShiftDetail) {
                res.status(404).json({
                    success: false,
                    message: 'Shift detail not found'
                });
                return;
            }
            const transformedShiftDetail = {
                id: updatedShiftDetail.employeeId,
                employeeId: updatedShiftDetail.employeeId,
                employeeName: updatedShiftDetail.employeeName,
                email: updatedShiftDetail.email,
                phone: updatedShiftDetail.phone,
                department: updatedShiftDetail.department,
                role: updatedShiftDetail.role,
                shiftType: updatedShiftDetail.shiftType,
                shiftStartTime: updatedShiftDetail.shiftStartTime,
                shiftEndTime: updatedShiftDetail.shiftEndTime,
                workDays: updatedShiftDetail.workDays,
                supervisor: updatedShiftDetail.supervisor,
                location: updatedShiftDetail.location,
                status: updatedShiftDetail.status,
                joinDate: updatedShiftDetail.joinDate,
                avatar: updatedShiftDetail.avatar,
                createdAt: updatedShiftDetail.createdAt,
                updatedAt: updatedShiftDetail.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedShiftDetail,
                message: 'Shift detail updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating shift detail:', error);
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                res.status(409).json({
                    success: false,
                    message: `Employee with this ${field} already exists`
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating shift detail',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteShiftDetail(req, res) {
        try {
            const { id } = req.params;
            const employeeId = Number(id);
            const deletedShiftDetail = await ShiftDetail_1.default.findOneAndDelete({ employeeId });
            if (!deletedShiftDetail) {
                res.status(404).json({
                    success: false,
                    message: 'Shift detail not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Shift detail deleted successfully',
                data: {
                    id: deletedShiftDetail.employeeId,
                    employeeName: deletedShiftDetail.employeeName
                }
            });
        }
        catch (error) {
            console.error('Error deleting shift detail:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting shift detail',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getShiftDetailStats(req, res) {
        try {
            const stats = await ShiftDetail_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalEmployees: { $sum: 1 },
                        activeEmployees: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        inactiveEmployees: {
                            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                        },
                        onLeaveEmployees: {
                            $sum: { $cond: [{ $eq: ['$status', 'on-leave'] }, 1, 0] }
                        },
                        dayShiftEmployees: {
                            $sum: { $cond: [{ $eq: ['$shiftType', 'day'] }, 1, 0] }
                        },
                        nightShiftEmployees: {
                            $sum: { $cond: [{ $eq: ['$shiftType', 'night'] }, 1, 0] }
                        },
                        rotatingShiftEmployees: {
                            $sum: { $cond: [{ $eq: ['$shiftType', 'rotating'] }, 1, 0] }
                        },
                        onCallEmployees: {
                            $sum: { $cond: [{ $eq: ['$shiftType', 'on-call'] }, 1, 0] }
                        }
                    }
                }
            ]);
            const departmentStats = await ShiftDetail_1.default.aggregate([
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 },
                        activeCount: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        }
                    }
                },
                { $sort: { count: -1 } }
            ]);
            const result = stats[0] || {
                totalEmployees: 0,
                activeEmployees: 0,
                inactiveEmployees: 0,
                onLeaveEmployees: 0,
                dayShiftEmployees: 0,
                nightShiftEmployees: 0,
                rotatingShiftEmployees: 0,
                onCallEmployees: 0
            };
            res.status(200).json({
                success: true,
                data: {
                    ...result,
                    departmentBreakdown: departmentStats
                },
                message: 'Shift detail statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching shift detail stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching shift detail statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.ShiftDetailController = ShiftDetailController;
