"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const express_validator_1 = require("express-validator");
const Department_1 = __importDefault(require("../models/Department"));
const Employee_1 = __importDefault(require("../models/Employee"));
class DepartmentController {
    static async getAllDepartments(req, res) {
        try {
            const { page = 1, limit = 10, search, status, sortBy = 'name', sortOrder = 'asc' } = req.query;
            const query = {};
            if (status && status !== 'all') {
                query.status = status;
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { manager: { $regex: search, $options: 'i' } }
                ];
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            const [departments, totalCount] = await Promise.all([
                Department_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean()
                    .exec(),
                Department_1.default.countDocuments(query)
            ]);
            const transformedDepartments = departments.map((dept) => ({
                id: dept._id.toString(),
                name: dept.name,
                code: dept.code,
                description: dept.description,
                manager: dept.manager,
                employeeCount: dept.employeeCount,
                status: dept.status,
                createdAt: dept.createdAt,
                updatedAt: dept.updatedAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    departments: transformedDepartments,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Departments retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching departments',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const department = await Department_1.default.findById(id).lean().exec();
            if (!department) {
                res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
                return;
            }
            const transformedDepartment = {
                id: department._id.toString(),
                name: department.name,
                code: department.code,
                description: department.description,
                manager: department.manager,
                employeeCount: department.employeeCount,
                status: department.status,
                createdAt: department.createdAt,
                updatedAt: department.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedDepartment,
                message: 'Department retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching department:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching department',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async createDepartment(req, res) {
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
            const { name, code, description, manager, employeeCount = 0, status = 'active', managerEmployee } = req.body;
            const existingDepartment = await Department_1.default.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') }
            }).exec();
            if (existingDepartment) {
                res.status(409).json({
                    success: false,
                    message: 'Department with this name already exists'
                });
                return;
            }
            let createdEmployee = null;
            if (managerEmployee) {
                const existingEmployee = await Employee_1.default.findOne({
                    email: managerEmployee.email.toLowerCase()
                }).exec();
                if (existingEmployee) {
                    res.status(409).json({
                        success: false,
                        message: 'Employee with this email already exists'
                    });
                    return;
                }
                const newEmployee = new Employee_1.default({
                    name: managerEmployee.name,
                    email: managerEmployee.email.toLowerCase(),
                    phone: managerEmployee.phone,
                    password: managerEmployee.password,
                    role: managerEmployee.role,
                    department: name,
                    accessLevel: managerEmployee.accessLevel,
                    status: managerEmployee.status,
                    employeeId: `EMP-${Date.now()}`,
                    joinDate: new Date()
                });
                createdEmployee = await newEmployee.save();
            }
            const department = new Department_1.default({
                name,
                code,
                description,
                manager,
                employeeCount: managerEmployee ? 1 : employeeCount,
                status
            });
            const savedDepartment = await department.save();
            const transformedDepartment = {
                id: savedDepartment._id.toString(),
                name: savedDepartment.name,
                code: savedDepartment.code,
                description: savedDepartment.description,
                manager: savedDepartment.manager,
                employeeCount: savedDepartment.employeeCount,
                status: savedDepartment.status,
                createdAt: savedDepartment.createdAt,
                updatedAt: savedDepartment.updatedAt
            };
            const responseData = {
                department: transformedDepartment
            };
            if (createdEmployee) {
                responseData.employee = {
                    id: createdEmployee._id.toString(),
                    name: createdEmployee.name,
                    email: createdEmployee.email,
                    phone: createdEmployee.phone,
                    role: createdEmployee.role,
                    department: createdEmployee.department,
                    accessLevel: createdEmployee.accessLevel,
                    status: createdEmployee.status,
                    employeeId: createdEmployee.employeeId
                };
            }
            res.status(201).json({
                success: true,
                data: responseData,
                message: createdEmployee
                    ? 'Department and manager employee created successfully'
                    : 'Department created successfully'
            });
        }
        catch (error) {
            console.error('Error creating department:', error);
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: 'Department with this name already exists'
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating department',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateDepartment(req, res) {
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
            const existingDepartment = await Department_1.default.findById(id).exec();
            if (!existingDepartment) {
                res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
                return;
            }
            if (updates.name && updates.name !== existingDepartment.name) {
                const duplicateDepartment = await Department_1.default.findOne({
                    name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
                    _id: { $ne: id }
                }).exec();
                if (duplicateDepartment) {
                    res.status(409).json({
                        success: false,
                        message: 'Department with this name already exists'
                    });
                    return;
                }
            }
            const updatedDepartment = await Department_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean().exec();
            if (!updatedDepartment) {
                res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
                return;
            }
            const transformedDepartment = {
                id: updatedDepartment._id.toString(),
                name: updatedDepartment.name,
                description: updatedDepartment.description,
                manager: updatedDepartment.manager,
                employeeCount: updatedDepartment.employeeCount,
                status: updatedDepartment.status,
                createdAt: updatedDepartment.createdAt,
                updatedAt: updatedDepartment.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedDepartment,
                message: 'Department updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating department:', error);
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: 'Department with this name already exists'
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating department',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteDepartment(req, res) {
        try {
            const { id } = req.params;
            const deletedDepartment = await Department_1.default.findByIdAndDelete(id).exec();
            if (!deletedDepartment) {
                res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Department deleted successfully',
                data: {
                    id: deletedDepartment._id.toString(),
                    name: deletedDepartment.name
                }
            });
        }
        catch (error) {
            console.error('Error deleting department:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting department',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getDepartmentStats(req, res) {
        try {
            const stats = await Department_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalDepartments: { $sum: 1 },
                        activeDepartments: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        inactiveDepartments: {
                            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                        },
                        totalEmployees: { $sum: '$employeeCount' },
                        averageEmployeeCount: { $avg: '$employeeCount' }
                    }
                }
            ]);
            const result = stats[0] || {
                totalDepartments: 0,
                activeDepartments: 0,
                inactiveDepartments: 0,
                totalEmployees: 0,
                averageEmployeeCount: 0
            };
            res.status(200).json({
                success: true,
                data: result,
                message: 'Department statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching department stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching department statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.DepartmentController = DepartmentController;
