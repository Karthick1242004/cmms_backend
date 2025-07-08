"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const express_validator_1 = require("express-validator");
const Employee_1 = __importDefault(require("../models/Employee"));
class EmployeeController {
    // Get all employees with optional filtering and pagination
    static async getAllEmployees(req, res) {
        try {
            const { page = 1, limit = 10, search, status, department, role, sortBy = 'name', sortOrder = 'asc' } = req.query;
            // Build query
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
            // Calculate pagination
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            // Execute query with pagination
            const [employees, totalCount] = await Promise.all([
                Employee_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                Employee_1.default.countDocuments(query)
            ]);
            // Transform for frontend compatibility
            const transformedEmployees = employees.map(emp => ({
                id: emp._id.toString(),
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                department: emp.department,
                role: emp.role,
                status: emp.status,
                avatar: emp.avatar,
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
    // Get employee by ID
    static async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            const employee = await Employee_1.default.findById(id).lean();
            if (!employee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            // Transform for frontend compatibility
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
    // Create new employee
    static async createEmployee(req, res) {
        try {
            // Check validation errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const { name, email, phone, department, role, status = 'active', avatar } = req.body;
            // Check if employee email already exists
            const existingEmployee = await Employee_1.default.findOne({
                email: email.toLowerCase()
            });
            if (existingEmployee) {
                res.status(409).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
                return;
            }
            // Create new employee
            const employee = new Employee_1.default({
                name,
                email: email.toLowerCase(),
                phone,
                department,
                role,
                status,
                avatar: avatar || '/placeholder-user.jpg'
            });
            const savedEmployee = await employee.save();
            // Transform for frontend compatibility
            const transformedEmployee = {
                id: savedEmployee._id.toString(),
                name: savedEmployee.name,
                email: savedEmployee.email,
                phone: savedEmployee.phone,
                department: savedEmployee.department,
                role: savedEmployee.role,
                status: savedEmployee.status,
                avatar: savedEmployee.avatar,
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
    // Update employee
    static async updateEmployee(req, res) {
        try {
            // Check validation errors
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
            // Check if employee exists
            const existingEmployee = await Employee_1.default.findById(id);
            if (!existingEmployee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            // If email is being updated, check for duplicates
            if (updates.email && updates.email.toLowerCase() !== existingEmployee.email) {
                const duplicateEmployee = await Employee_1.default.findOne({
                    email: updates.email.toLowerCase(),
                    _id: { $ne: id }
                });
                if (duplicateEmployee) {
                    res.status(409).json({
                        success: false,
                        message: 'Employee with this email already exists'
                    });
                    return;
                }
            }
            // Normalize email if provided
            if (updates.email) {
                updates.email = updates.email.toLowerCase();
            }
            // Update employee
            const updatedEmployee = await Employee_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
            if (!updatedEmployee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            // Transform for frontend compatibility
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
    // Delete employee
    static async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const deletedEmployee = await Employee_1.default.findByIdAndDelete(id);
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
    // Get employee statistics
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
            // Get department breakdown
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
            // Get role breakdown
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
//# sourceMappingURL=employeeController.js.map