"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const express_validator_1 = require("express-validator");
const Employee_1 = __importDefault(require("../models/Employee"));
const mongoose_1 = __importDefault(require("mongoose"));
class EmployeeController {
    static async getAllEmployees(req, res) {
        try {
            const { page = 1, limit = 10, search, status, department, role, sortBy = 'name', sortOrder = 'asc' } = req.query;
            const query = {};
            if (status && status !== 'all') {
                query.status = status;
            }
            if (department && department !== 'all') {
                query.department = { $regex: department, $options: 'i' };
            }
            if (role && role !== 'all') {
                query.role = { $regex: role, $options: 'i' };
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } }
                ];
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            const [employees, totalCount] = await Promise.all([
                Employee_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean()
                    .exec(),
                Employee_1.default.countDocuments(query)
            ]);
            const transformedEmployees = employees.map((emp) => ({
                id: emp._id.toString(),
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                department: emp.department,
                role: emp.role,
                status: emp.status,
                avatar: emp.avatar,
                employeeId: emp.employeeId,
                joinDate: emp.joinDate,
                supervisor: emp.supervisor,
                accessLevel: emp.accessLevel,
                shiftInfo: emp.shiftInfo,
                createdAt: emp.createdAt,
                updatedAt: emp.updatedAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    employees: transformedEmployees,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Employees retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching employees',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            const employee = await Employee_1.default.findById(id).lean().exec();
            if (!employee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            const transformedEmployee = {
                id: employee._id.toString(),
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                department: employee.department,
                role: employee.role,
                status: employee.status,
                avatar: employee.avatar,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedEmployee,
                message: 'Employee retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching employee',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async createEmployee(req, res) {
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
            const { name, email, password, phone, department, role, status = 'active', avatar, employeeId, joinDate, supervisor, accessLevel = 'normal_user', skills, certifications, shiftInfo, emergencyContact } = req.body;
            if (!password) {
                res.status(400).json({
                    success: false,
                    message: 'Password is required'
                });
                return;
            }
            const existingEmployee = await Employee_1.default.findOne({
                email: email.toLowerCase()
            }).exec();
            if (existingEmployee) {
                res.status(409).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
                return;
            }
            const employee = new Employee_1.default({
                name,
                email: email.toLowerCase(),
                password,
                phone,
                department,
                role,
                status,
                avatar: avatar || '/placeholder-user.jpg',
                employeeId,
                joinDate,
                supervisor,
                accessLevel,
                skills,
                certifications,
                shiftInfo,
                emergencyContact
            });
            const savedEmployee = await employee.save();
            const transformedEmployee = {
                id: savedEmployee._id.toString(),
                name: savedEmployee.name,
                email: savedEmployee.email,
                phone: savedEmployee.phone,
                department: savedEmployee.department,
                role: savedEmployee.role,
                status: savedEmployee.status,
                avatar: savedEmployee.avatar,
                employeeId: savedEmployee.employeeId,
                joinDate: savedEmployee.joinDate,
                supervisor: savedEmployee.supervisor,
                accessLevel: savedEmployee.accessLevel,
                skills: savedEmployee.skills,
                certifications: savedEmployee.certifications,
                shiftInfo: savedEmployee.shiftInfo,
                emergencyContact: savedEmployee.emergencyContact,
                createdAt: savedEmployee.createdAt,
                updatedAt: savedEmployee.updatedAt
            };
            res.status(201).json({
                success: true,
                data: transformedEmployee,
                message: 'Employee created successfully'
            });
        }
        catch (error) {
            console.error('Error creating employee:', error);
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating employee',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateEmployee(req, res) {
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
            const existingEmployee = await Employee_1.default.findById(id).exec();
            if (!existingEmployee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            if (updates.email && updates.email.toLowerCase() !== existingEmployee.email) {
                const duplicateEmployee = await Employee_1.default.findOne({
                    email: updates.email.toLowerCase(),
                    _id: { $ne: id }
                }).exec();
                if (duplicateEmployee) {
                    res.status(409).json({
                        success: false,
                        message: 'Employee with this email already exists'
                    });
                    return;
                }
            }
            if (updates.email) {
                updates.email = updates.email.toLowerCase();
            }
            let updatedEmployee;
            if (updates.password) {
                Object.assign(existingEmployee, updates);
                const savedEmployee = await existingEmployee.save();
                updatedEmployee = savedEmployee.toObject();
            }
            else {
                updatedEmployee = await Employee_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean().exec();
            }
            if (!updatedEmployee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            const transformedEmployee = {
                id: updatedEmployee._id.toString(),
                name: updatedEmployee.name,
                email: updatedEmployee.email,
                phone: updatedEmployee.phone,
                department: updatedEmployee.department,
                role: updatedEmployee.role,
                status: updatedEmployee.status,
                avatar: updatedEmployee.avatar,
                createdAt: updatedEmployee.createdAt,
                updatedAt: updatedEmployee.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedEmployee,
                message: 'Employee updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating employee:', error);
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating employee',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const deletedEmployee = await Employee_1.default.findByIdAndDelete(id).exec();
            if (!deletedEmployee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Employee deleted successfully',
                data: {
                    id: deletedEmployee._id.toString(),
                    name: deletedEmployee.name,
                    email: deletedEmployee.email
                }
            });
        }
        catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting employee',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getEmployeeDetails(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Employee ID is required'
                });
                return;
            }
            const employee = await Employee_1.default.findById(id).lean().exec();
            if (!employee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            const workHistory = await EmployeeController.aggregateWorkHistory(id);
            const currentAssets = await EmployeeController.getCurrentAssetAssignments(id);
            const performanceMetrics = await EmployeeController.calculatePerformanceMetrics(id, workHistory);
            const transformedEmployee = {
                id: employee._id.toString(),
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                department: employee.department,
                role: employee.role,
                status: employee.status,
                avatar: employee.avatar,
                employeeId: employee.employeeId,
                joinDate: employee.joinDate,
                supervisor: employee.supervisor,
                skills: employee.skills || [],
                certifications: employee.certifications || [],
                shiftInfo: employee.shiftInfo,
                emergencyContact: employee.emergencyContact,
                workHistory: workHistory,
                assetAssignments: employee.assetAssignments || [],
                currentAssignments: currentAssets,
                performanceMetrics: performanceMetrics,
                totalWorkHours: employee.totalWorkHours || 0,
                productivityScore: employee.productivityScore || 0,
                reliabilityScore: employee.reliabilityScore || 0,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedEmployee,
                message: 'Employee details retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching employee details:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching employee details',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getEmployeeAnalytics(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Employee ID is required'
                });
                return;
            }
            const employee = await Employee_1.default.findById(id).exec();
            if (!employee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            const analytics = await EmployeeController.generateEmployeeAnalytics(id);
            res.status(200).json({
                success: true,
                data: analytics,
                message: 'Employee analytics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching employee analytics:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching employee analytics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getEmployeeWorkHistory(req, res) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 20, type, startDate, endDate } = req.query;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Employee ID is required'
                });
                return;
            }
            const employee = await Employee_1.default.findById(id).exec();
            if (!employee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            const workHistory = await EmployeeController.getFilteredWorkHistory(id, {
                page: Number(page),
                limit: Number(limit),
                type: type,
                startDate: startDate,
                endDate: endDate
            });
            res.status(200).json({
                success: true,
                data: workHistory,
                message: 'Employee work history retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching employee work history:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching employee work history',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async aggregateWorkHistory(employeeId) {
        try {
            const workHistory = [];
            const ticketsCollection = mongoose_1.default.connection.db?.collection('tickets');
            if (ticketsCollection) {
                const tickets = await ticketsCollection.find({
                    $or: [
                        { loggedBy: employeeId },
                        { assignedUsers: employeeId },
                        { inCharge: employeeId }
                    ]
                }).sort({ loggedDateTime: -1 }).limit(100).toArray();
                tickets.forEach(ticket => {
                    workHistory.push({
                        date: new Date(ticket.loggedDateTime),
                        type: 'ticket',
                        referenceId: ticket._id.toString(),
                        title: ticket.subject,
                        description: ticket.description,
                        status: ticket.status,
                        assetId: ticket.equipmentId,
                        assetName: ticket.equipmentName || 'N/A',
                        priority: ticket.priority
                    });
                });
            }
            const maintenanceCollection = mongoose_1.default.connection.db?.collection('maintenancerecords');
            if (maintenanceCollection) {
                const maintenanceRecords = await maintenanceCollection.find({
                    $or: [
                        { technicianId: employeeId },
                        { technician: employeeId },
                        { adminVerifiedBy: employeeId }
                    ]
                }).sort({ completedDate: -1 }).limit(100).toArray();
                maintenanceRecords.forEach(record => {
                    workHistory.push({
                        date: new Date(record.completedDate),
                        type: 'maintenance',
                        referenceId: record._id.toString(),
                        title: `Maintenance: ${record.assetName}`,
                        description: record.notes,
                        status: record.status,
                        assetId: record.assetId,
                        assetName: record.assetName,
                        duration: record.actualDuration
                    });
                });
            }
            const dailyLogCollection = mongoose_1.default.connection.db?.collection('dailylogactivities');
            if (dailyLogCollection) {
                const dailyLogs = await dailyLogCollection.find({
                    $or: [
                        { attendedBy: employeeId },
                        { verifiedBy: employeeId },
                        { createdBy: employeeId }
                    ]
                }).sort({ date: -1 }).limit(100).toArray();
                dailyLogs.forEach(log => {
                    workHistory.push({
                        date: new Date(log.date),
                        type: 'daily-log',
                        referenceId: log._id.toString(),
                        title: log.natureOfProblem,
                        description: log.commentsOrSolution,
                        status: log.status,
                        assetId: log.assetId,
                        assetName: log.assetName,
                        priority: log.priority
                    });
                });
            }
            const safetyInspectionCollection = mongoose_1.default.connection.db?.collection('safetyinspectionrecords');
            if (safetyInspectionCollection) {
                const safetyRecords = await safetyInspectionCollection.find({
                    $or: [
                        { inspectorId: employeeId },
                        { inspector: employeeId },
                        { supervisorId: employeeId }
                    ]
                }).sort({ inspectionDate: -1 }).limit(100).toArray();
                safetyRecords.forEach(record => {
                    workHistory.push({
                        date: new Date(record.inspectionDate),
                        type: 'safety-inspection',
                        referenceId: record._id.toString(),
                        title: `Safety Inspection: ${record.assetName || record.area}`,
                        description: record.notes,
                        status: record.status,
                        assetId: record.assetId,
                        assetName: record.assetName,
                        duration: record.duration
                    });
                });
            }
            workHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return workHistory.slice(0, 50);
        }
        catch (error) {
            console.error('Error aggregating work history:', error);
            return [];
        }
    }
    static async getCurrentAssetAssignments(employeeId) {
        try {
            const assignedAssets = [];
            const assetsCollection = mongoose_1.default.connection.db?.collection('assets');
            if (assetsCollection) {
                const assets = await assetsCollection.find({
                    $or: [
                        { 'personnel.employeeId': employeeId },
                        { assignedTo: employeeId },
                        { responsiblePerson: employeeId }
                    ]
                }).toArray();
                assets.forEach(asset => {
                    assignedAssets.push(asset._id.toString());
                });
            }
            return assignedAssets;
        }
        catch (error) {
            console.error('Error getting current asset assignments:', error);
            return [];
        }
    }
    static async calculatePerformanceMetrics(employeeId, workHistory) {
        try {
            const tickets = workHistory.filter(item => item.type === 'ticket');
            const maintenance = workHistory.filter(item => item.type === 'maintenance');
            const dailyLogs = workHistory.filter(item => item.type === 'daily-log');
            const safetyInspections = workHistory.filter(item => item.type === 'safety-inspection');
            const totalTasksCompleted = workHistory.filter(item => ['completed', 'resolved', 'closed'].includes(item.status.toLowerCase())).length;
            const totalDuration = workHistory
                .filter(item => item.duration)
                .reduce((sum, item) => sum + (item.duration || 0), 0);
            const averageCompletionTime = totalTasksCompleted > 0 ? totalDuration / totalTasksCompleted : 0;
            const lastActivityDate = workHistory.length > 0 && workHistory[0] ? new Date(workHistory[0].date) : new Date();
            const efficiency = workHistory.length > 0 ? (totalTasksCompleted / workHistory.length) * 100 : 0;
            return {
                totalTasksCompleted,
                averageCompletionTime,
                ticketsResolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status.toLowerCase())).length,
                maintenanceCompleted: maintenance.filter(m => m.status.toLowerCase() === 'completed').length,
                safetyInspectionsCompleted: safetyInspections.filter(s => s.status.toLowerCase() === 'completed').length,
                dailyLogEntries: dailyLogs.length,
                lastActivityDate,
                efficiency: Math.round(efficiency),
                rating: Math.min(5, Math.max(1, Math.round((efficiency / 20) + 1)))
            };
        }
        catch (error) {
            console.error('Error calculating performance metrics:', error);
            return {
                totalTasksCompleted: 0,
                averageCompletionTime: 0,
                ticketsResolved: 0,
                maintenanceCompleted: 0,
                safetyInspectionsCompleted: 0,
                dailyLogEntries: 0,
                efficiency: 0,
                rating: 3
            };
        }
    }
    static async generateEmployeeAnalytics(employeeId) {
        try {
            const workHistory = await EmployeeController.aggregateWorkHistory(employeeId);
            const performanceMetrics = await EmployeeController.calculatePerformanceMetrics(employeeId, workHistory);
            const monthlyActivity = EmployeeController.getMonthlyActivityData(workHistory);
            const taskDistribution = EmployeeController.getTaskDistributionData(workHistory);
            const performanceTrends = EmployeeController.getPerformanceTrends(workHistory);
            const assetWorkload = EmployeeController.getAssetWorkloadData(workHistory);
            return {
                performanceMetrics,
                monthlyActivity,
                taskDistribution,
                performanceTrends,
                assetWorkload,
                summary: {
                    totalActivities: workHistory.length,
                    averageTasksPerMonth: monthlyActivity.reduce((sum, month) => sum + month.count, 0) / 12,
                    mostActiveMonth: monthlyActivity.reduce((max, month) => month.count > max.count ? month : max, { count: 0, month: '' }),
                    primaryTaskType: taskDistribution.reduce((max, task) => task.count > max.count ? task : max, { count: 0, type: '' })
                }
            };
        }
        catch (error) {
            console.error('Error generating employee analytics:', error);
            return {};
        }
    }
    static async getFilteredWorkHistory(employeeId, filters) {
        try {
            const workHistory = await EmployeeController.aggregateWorkHistory(employeeId);
            let filteredHistory = workHistory;
            if (filters.type) {
                filteredHistory = filteredHistory.filter(item => item.type === filters.type);
            }
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                filteredHistory = filteredHistory.filter(item => new Date(item.date) >= startDate);
            }
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                filteredHistory = filteredHistory.filter(item => new Date(item.date) <= endDate);
            }
            const startIndex = (filters.page - 1) * filters.limit;
            const endIndex = startIndex + filters.limit;
            const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
            return {
                items: paginatedHistory,
                pagination: {
                    currentPage: filters.page,
                    totalPages: Math.ceil(filteredHistory.length / filters.limit),
                    totalCount: filteredHistory.length,
                    hasNext: endIndex < filteredHistory.length,
                    hasPrevious: filters.page > 1
                }
            };
        }
        catch (error) {
            console.error('Error getting filtered work history:', error);
            return { items: [], pagination: {} };
        }
    }
    static getMonthlyActivityData(workHistory) {
        const monthlyData = new Map();
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            monthlyData.set(monthKey, {
                month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
                count: 0,
                tickets: 0,
                maintenance: 0,
                dailyLog: 0,
                safetyInspection: 0
            });
        }
        workHistory.forEach(item => {
            const date = new Date(item.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (monthlyData.has(monthKey)) {
                const monthData = monthlyData.get(monthKey);
                monthData.count++;
                switch (item.type) {
                    case 'ticket':
                        monthData.tickets++;
                        break;
                    case 'maintenance':
                        monthData.maintenance++;
                        break;
                    case 'daily-log':
                        monthData.dailyLog++;
                        break;
                    case 'safety-inspection':
                        monthData.safetyInspection++;
                        break;
                }
            }
        });
        return Array.from(monthlyData.values());
    }
    static getTaskDistributionData(workHistory) {
        const distribution = {
            ticket: 0,
            maintenance: 0,
            'daily-log': 0,
            'safety-inspection': 0
        };
        workHistory.forEach(item => {
            distribution[item.type]++;
        });
        return Object.entries(distribution).map(([type, count]) => ({
            type: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count,
            percentage: workHistory.length > 0 ? Math.round((count / workHistory.length) * 100) : 0
        }));
    }
    static getPerformanceTrends(workHistory) {
        const trends = [];
        const currentDate = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
            const monthActivities = workHistory.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= date && itemDate < nextDate;
            });
            const completed = monthActivities.filter(item => ['completed', 'resolved', 'closed'].includes(item.status.toLowerCase())).length;
            trends.push({
                month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
                efficiency: monthActivities.length > 0 ? Math.round((completed / monthActivities.length) * 100) : 0,
                totalTasks: monthActivities.length,
                completedTasks: completed
            });
        }
        return trends;
    }
    static getAssetWorkloadData(workHistory) {
        const assetWorkload = new Map();
        workHistory.forEach(item => {
            if (item.assetId && item.assetName) {
                if (!assetWorkload.has(item.assetId)) {
                    assetWorkload.set(item.assetId, {
                        assetId: item.assetId,
                        assetName: item.assetName,
                        count: 0,
                        types: {
                            ticket: 0,
                            maintenance: 0,
                            'daily-log': 0,
                            'safety-inspection': 0
                        }
                    });
                }
                const asset = assetWorkload.get(item.assetId);
                asset.count++;
                asset.types[item.type]++;
            }
        });
        return Array.from(assetWorkload.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    static async getEmployeesAsShiftDetails(req, res) {
        try {
            const { page = 1, limit = 10, search, department, shiftType, status, location, sortBy = 'name', sortOrder = 'asc' } = req.query;
            const query = {};
            if (department && department !== 'all') {
                query.department = { $regex: department, $options: 'i' };
            }
            if (shiftType && shiftType !== 'all') {
                query['shiftInfo.shiftType'] = shiftType;
            }
            if (status && status !== 'all') {
                query.status = status;
            }
            if (location && location !== 'all') {
                query['shiftInfo.location'] = { $regex: location, $options: 'i' };
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } },
                    { supervisor: { $regex: search, $options: 'i' } }
                ];
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            const [employees, totalCount] = await Promise.all([
                Employee_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean()
                    .exec(),
                Employee_1.default.countDocuments(query)
            ]);
            const transformedShiftDetails = employees.map((emp) => ({
                id: emp.employeeId || emp._id.toString(),
                employeeId: emp.employeeId || emp._id.toString(),
                employeeName: emp.name,
                email: emp.email,
                phone: emp.phone,
                department: emp.department,
                role: emp.role,
                shiftType: emp.shiftInfo?.shiftType || 'day',
                shiftStartTime: emp.shiftInfo?.shiftStartTime || '08:00',
                shiftEndTime: emp.shiftInfo?.shiftEndTime || '16:00',
                workDays: emp.shiftInfo?.workDays || [],
                supervisor: emp.supervisor || '',
                location: emp.shiftInfo?.location || 'Not assigned',
                status: emp.status,
                joinDate: emp.joinDate ? emp.joinDate.toISOString().split('T')[0] : '',
                avatar: emp.avatar,
                createdAt: emp.createdAt,
                updatedAt: emp.updatedAt
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
    static async getEmployeeStats(req, res) {
        try {
            const stats = await Employee_1.default.aggregate([
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
                    }
                }
            ]);
            const departmentStats = await Employee_1.default.aggregate([
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
            const roleStats = await Employee_1.default.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            const result = stats[0] || {
                totalEmployees: 0,
                activeEmployees: 0,
                inactiveEmployees: 0,
            };
            result.departmentBreakdown = departmentStats;
            result.roleBreakdown = roleStats;
            res.status(200).json({
                success: true,
                data: result,
                message: 'Employee statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching employee stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching employee statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.EmployeeController = EmployeeController;
