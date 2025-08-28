import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Employee, { IEmployee } from '../models/Employee';
import jwt from 'jsonwebtoken';

export class ProfileController {
  // Helper function to get user from JWT token
  private static async getUserFromToken(req: Request): Promise<IEmployee | null> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return null;
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }
      
      // Use the same JWT_SECRET validation as authMiddleware
      const JWT_SECRET = process.env.JWT_SECRET;
      if (JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
      }
      
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await (Employee as any).findById(decoded.userId).select('-password');
      return user;
    } catch (error) {
      return null;
    }
  }

  // GET user profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await ProfileController.getUserFromToken(req);
      
      if (!user) {
        res.status(401).json({ 
          success: false, 
          message: 'Unauthorized - User not authenticated' 
        });
        return;
      }

      // Return comprehensive profile data
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
        // Additional profile fields
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || '',
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.status(200).json({
        success: true,
        data: { user: profileData },
        message: 'Profile retrieved successfully'
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching profile',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // PUT update user profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
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

      // Fields that users can update themselves
      const allowedFields = [
        'name',
        'phone',
        'skills',
        'certifications',
        'emergencyContact',
        // Personal information fields
        'firstName',
        'lastName',
        'address',
        'city',
        'country',
        'jobTitle',
        'bio'
      ];

      // Build update object with only allowed fields
      const updates: any = {};
      allowedFields.forEach(field => {
        if (updateData.hasOwnProperty(field) && updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      // Special handling for name field - combine firstName and lastName if provided
      if (updateData.firstName || updateData.lastName) {
        const firstName = updateData.firstName || user.name?.split(' ')[0] || '';
        const lastName = updateData.lastName || user.name?.split(' ').slice(1).join(' ') || '';
        updates.name = `${firstName} ${lastName}`.trim();
      }

      // Normalize emergency contact fields (do not hard-fail on partial input)
      if (updates.emergencyContact) {
        const ec = updates.emergencyContact as any;
        updates.emergencyContact = {
          name: typeof ec.name === 'string' ? ec.name.trim() : '',
          relationship: typeof ec.relationship === 'string' ? ec.relationship.trim() : '',
          phone: typeof ec.phone === 'string' ? ec.phone.trim() : ''
        };
      }

      // Update the employee record
      const updatedEmployee = await (Employee as any).findByIdAndUpdate(
        user._id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedEmployee) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Return updated profile data
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
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: Object.values(error.errors).map((err: any) => ({
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

  // GET profile by employee ID (for admin purposes)
  static async getProfileByEmployeeId(req: Request, res: Response): Promise<void> {
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

      // Check if user has permission to view other profiles
      if (requestingUser.accessLevel !== 'super_admin' && 
          requestingUser.accessLevel !== 'department_admin' &&
          requestingUser.employeeId !== employeeId) {
        res.status(403).json({
          success: false,
          message: 'Unauthorized - Insufficient permissions'
        });
        return;
      }

      const employee = await (Employee as any).findOne({ employeeId }).select('-password');
      
      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }

      // For department admins, ensure they can only view employees in their department
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
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching profile',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
