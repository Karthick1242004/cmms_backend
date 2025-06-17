import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Department, { IDepartment } from '../models/Department';

export class DepartmentController {
  // Get all departments with optional filtering and pagination
  static async getAllDepartments(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        sortBy = 'name', 
        sortOrder = 'asc' 
      } = req.query;

      // Build query
      const query: any = {};
      
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

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);
      const sortDirection = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const [departments, totalCount] = await Promise.all([
        Department.find(query)
          .sort({ [sortBy as string]: sortDirection })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Department.countDocuments(query)
      ]);

      // Transform for frontend compatibility
      const transformedDepartments = departments.map(dept => ({
        id: dept._id.toString(),
        name: dept.name,
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
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching departments',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get department by ID
  static async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const department = await Department.findById(id).lean();

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      // Transform for frontend compatibility
      const transformedDepartment = {
        id: department._id.toString(),
        name: department.name,
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
    } catch (error: any) {
      console.error('Error fetching department:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching department',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Create new department
  static async createDepartment(req: Request, res: Response): Promise<void> {
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

      const { name, description, manager, employeeCount = 0, status = 'active' } = req.body;

      // Check if department name already exists
      const existingDepartment = await Department.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });

      if (existingDepartment) {
        res.status(409).json({
          success: false,
          message: 'Department with this name already exists'
        });
        return;
      }

      // Create new department
      const department = new Department({
        name,
        description,
        manager,
        employeeCount,
        status
      });

      const savedDepartment = await department.save();

      // Transform for frontend compatibility
      const transformedDepartment = {
        id: savedDepartment._id.toString(),
        name: savedDepartment.name,
        description: savedDepartment.description,
        manager: savedDepartment.manager,
        employeeCount: savedDepartment.employeeCount,
        status: savedDepartment.status,
        createdAt: savedDepartment.createdAt,
        updatedAt: savedDepartment.updatedAt
      };

      res.status(201).json({
        success: true,
        data: transformedDepartment,
        message: 'Department created successfully'
      });
    } catch (error: any) {
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

  // Update department
  static async updateDepartment(req: Request, res: Response): Promise<void> {
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

      const { id } = req.params;
      const updates = req.body;

      // Check if department exists
      const existingDepartment = await Department.findById(id);
      if (!existingDepartment) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      // If name is being updated, check for duplicates
      if (updates.name && updates.name !== existingDepartment.name) {
        const duplicateDepartment = await Department.findOne({
          name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
          _id: { $ne: id }
        });

        if (duplicateDepartment) {
          res.status(409).json({
            success: false,
            message: 'Department with this name already exists'
          });
          return;
        }
      }

      // Update department
      const updatedDepartment = await Department.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedDepartment) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      // Transform for frontend compatibility
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
    } catch (error: any) {
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

  // Delete department
  static async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedDepartment = await Department.findByIdAndDelete(id);

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
    } catch (error: any) {
      console.error('Error deleting department:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting department',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get department statistics
  static async getDepartmentStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await Department.aggregate([
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
    } catch (error: any) {
      console.error('Error fetching department stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching department statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
} 