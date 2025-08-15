"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const express_validator_1 = require("express-validator");
const Employee_1 = __importDefault(require("../models/Employee"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ProfileController {
    static async getUserFromToken(req) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return null;
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
            const user = await Employee_1.default.findById(decoded.userId).select('-password');
            return user;
        }
        catch (error) {
            return null;
        }
    }
    static async getProfile(req, res) {
        try {
            const user = await ProfileController.getUserFromToken(req);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized - User not authenticated'
                });
                return;
            }
            const profileData = {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                department: user.department,
                role: user.role,
                status: user.status,
                avatar: user.avatar || '/placeholder-user.jpg',
                employeeId: user.employeeId,
                joinDate: user.joinDate,
                supervisor: user.supervisor,
                accessLevel: user.accessLevel,
                shiftInfo: user.shiftInfo,
                skills: user.skills || [],
                certifications: user.certifications || [],
                emergencyContact: user.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: ''
                },
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            res.status(200).json({
                success: true,
                data: { user: profileData },
                message: 'Profile retrieved successfully'
            });
        }
        catch (error) {
            console.error('Profile fetch error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching profile',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateProfile(req, res) {
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
            const user = await ProfileController.getUserFromToken(req);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized - User not authenticated'
                });
                return;
            }
            const updateData = req.body;
            const allowedFields = [
                'name',
                'phone',
                'skills',
                'certifications',
                'emergencyContact',
                'firstName',
                'lastName',
                'address',
                'city',
                'country',
                'jobTitle',
                'bio'
            ];
            const updates = {};
            allowedFields.forEach(field => {
                if (updateData.hasOwnProperty(field) && updateData[field] !== undefined) {
                    updates[field] = updateData[field];
                }
            });
            if (updateData.firstName || updateData.lastName) {
                const firstName = updateData.firstName || user.name?.split(' ')[0] || '';
                const lastName = updateData.lastName || user.name?.split(' ').slice(1).join(' ') || '';
                updates.name = `${firstName} ${lastName}`.trim();
            }
            if (updates.emergencyContact) {
                const ec = updates.emergencyContact;
                if (ec.name === "" && ec.relationship === "" && ec.phone === "") {
                    updates.emergencyContact = {
                        name: '',
                        relationship: '',
                        phone: ''
                    };
                }
                else if ((ec.name && ec.name.length > 0) || (ec.relationship && ec.relationship.length > 0) || (ec.phone && ec.phone.length > 0)) {
                    if (!ec.name || !ec.relationship || !ec.phone) {
                        res.status(400).json({
                            success: false,
                            message: 'Emergency contact requires all fields: name, relationship, and phone'
                        });
                        return;
                    }
                }
            }
            const updatedEmployee = await Employee_1.default.findByIdAndUpdate(user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');
            if (!updatedEmployee) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            const profileData = {
                id: updatedEmployee._id,
                name: updatedEmployee.name,
                email: updatedEmployee.email,
                phone: updatedEmployee.phone,
                department: updatedEmployee.department,
                role: updatedEmployee.role,
                status: updatedEmployee.status,
                avatar: updatedEmployee.avatar || '/placeholder-user.jpg',
                employeeId: updatedEmployee.employeeId,
                joinDate: updatedEmployee.joinDate,
                supervisor: updatedEmployee.supervisor,
                accessLevel: updatedEmployee.accessLevel,
                shiftInfo: updatedEmployee.shiftInfo,
                skills: updatedEmployee.skills || [],
                certifications: updatedEmployee.certifications || [],
                emergencyContact: updatedEmployee.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: ''
                },
                lastLoginAt: updatedEmployee.lastLoginAt,
                createdAt: updatedEmployee.createdAt,
                updatedAt: updatedEmployee.updatedAt
            };
            res.status(200).json({
                success: true,
                data: { user: profileData },
                message: 'Profile updated successfully'
            });
        }
        catch (error) {
            console.error('Profile update error:', error);
            if (error.name === 'ValidationError') {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: Object.values(error.errors).map((err) => ({
                        field: err.path,
                        message: err.message
                    }))
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating profile',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getProfileByEmployeeId(req, res) {
        try {
            const { employeeId } = req.params;
            const requestingUser = await ProfileController.getUserFromToken(req);
            if (!requestingUser) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized - User not authenticated'
                });
                return;
            }
            if (requestingUser.accessLevel !== 'super_admin' &&
                requestingUser.accessLevel !== 'department_admin' &&
                requestingUser.employeeId !== employeeId) {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized - Insufficient permissions'
                });
                return;
            }
            const employee = await Employee_1.default.findOne({ employeeId }).select('-password');
            if (!employee) {
                res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
                return;
            }
            if (requestingUser.accessLevel === 'department_admin' &&
                employee.department !== requestingUser.department) {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized - Can only view employees in your department'
                });
                return;
            }
            const profileData = {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                department: employee.department,
                role: employee.role,
                status: employee.status,
                avatar: employee.avatar || '/placeholder-user.jpg',
                employeeId: employee.employeeId,
                joinDate: employee.joinDate,
                supervisor: employee.supervisor,
                accessLevel: employee.accessLevel,
                shiftInfo: employee.shiftInfo,
                skills: employee.skills || [],
                certifications: employee.certifications || [],
                emergencyContact: employee.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: ''
                },
                lastLoginAt: employee.lastLoginAt,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            };
            res.status(200).json({
                success: true,
                data: { user: profileData },
                message: 'Profile retrieved successfully'
            });
        }
        catch (error) {
            console.error('Profile fetch error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching profile',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.ProfileController = ProfileController;
