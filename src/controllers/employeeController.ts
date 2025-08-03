import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Employee, { IEmployee, IWorkHistoryEntry, IAssetAssignment, IPerformanceMetrics } from '../models/Employee';
import mongoose from 'mongoose';

export class EmployeeController {
  // Get all employees with optional filtering and pagination
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        department,
        role,
        sortBy = 'name', 
        sortOrder = 'asc' 
      } = req.query;

      // Build query
      const query: any = {};
      
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
        Employee.find(query)
          .sort({ [sortBy as string]: sortDirection })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Employee.countDocuments(query)
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
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching employees',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get employee by ID
  static async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const employee = await Employee.findById(id).lean();

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
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching employee',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Create new employee
  static async createEmployee(req: Request, res: Response): Promise<void> {
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

      const { name, email, phone, department, role, status = 'active', avatar } = req.body;

      // Check if employee email already exists
      const existingEmployee = await Employee.findOne({ 
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
      const employee = new Employee({
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
    } catch (error: any) {
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
  static async updateEmployee(req: Request, res: Response): Promise<void> {
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

      // Check if employee exists
      const existingEmployee = await Employee.findById(id);
      if (!existingEmployee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }

      // If email is being updated, check for duplicates
      if (updates.email && updates.email.toLowerCase() !== existingEmployee.email) {
        const duplicateEmployee = await Employee.findOne({
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
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();

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
    } catch (error: any) {
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
  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedEmployee = await Employee.findByIdAndDelete(id);

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
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting employee',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get detailed employee information with work history and analytics
  static async getEmployeeDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
        return;
      }

      const employee = await Employee.findById(id).lean();

      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }

      // Get work history from other collections (tickets, maintenance, etc.)
      const workHistory = await EmployeeController.aggregateWorkHistory(id);
      
      // Get current asset assignments
      const currentAssets = await EmployeeController.getCurrentAssetAssignments(id);
      
      // Calculate performance metrics
      const performanceMetrics = await EmployeeController.calculatePerformanceMetrics(id, workHistory);

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
        employeeId: employee.employeeId,
        joinDate: employee.joinDate,
        supervisor: employee.supervisor,
        skills: employee.skills || [],
        certifications: employee.certifications || [],
        workShift: employee.workShift,
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
    } catch (error: any) {
      console.error('Error fetching employee details:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching employee details',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get employee analytics and performance metrics
  static async getEmployeeAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
        return;
      }

      const employee = await Employee.findById(id);

      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }

      // Get comprehensive analytics data
      const analytics = await EmployeeController.generateEmployeeAnalytics(id);

      res.status(200).json({
        success: true,
        data: analytics,
        message: 'Employee analytics retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching employee analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching employee analytics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get employee work history
  static async getEmployeeWorkHistory(req: Request, res: Response): Promise<void> {
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

      const employee = await Employee.findById(id);

      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }

      // Get filtered work history
      const workHistory = await EmployeeController.getFilteredWorkHistory(
        id, 
        {
          page: Number(page),
          limit: Number(limit),
          type: type as string,
          startDate: startDate as string,
          endDate: endDate as string
        }
      );

      res.status(200).json({
        success: true,
        data: workHistory,
        message: 'Employee work history retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching employee work history:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching employee work history',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Helper method to aggregate work history from multiple collections
  static async aggregateWorkHistory(employeeId: string): Promise<IWorkHistoryEntry[]> {
    try {
      const workHistory: IWorkHistoryEntry[] = [];

      // Get tickets where employee is involved
      const ticketsCollection = mongoose.connection.db?.collection('tickets');
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

      // Get maintenance records
      const maintenanceCollection = mongoose.connection.db?.collection('maintenancerecords');
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

      // Get daily log activities
      const dailyLogCollection = mongoose.connection.db?.collection('dailylogactivities');
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

      // Get safety inspection records
      const safetyInspectionCollection = mongoose.connection.db?.collection('safetyinspectionrecords');
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

      // Sort by date (newest first)
      workHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return workHistory.slice(0, 50); // Return latest 50 entries
    } catch (error) {
      console.error('Error aggregating work history:', error);
      return [];
    }
  }

  // Helper method to get current asset assignments
  static async getCurrentAssetAssignments(employeeId: string): Promise<string[]> {
    try {
      const assignedAssets: string[] = [];

      // Get assets from various collections where employee is assigned
      const assetsCollection = mongoose.connection.db?.collection('assets');
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
    } catch (error) {
      console.error('Error getting current asset assignments:', error);
      return [];
    }
  }

  // Helper method to calculate performance metrics
  static async calculatePerformanceMetrics(employeeId: string, workHistory: IWorkHistoryEntry[]): Promise<IPerformanceMetrics> {
    try {
      const tickets = workHistory.filter(item => item.type === 'ticket');
      const maintenance = workHistory.filter(item => item.type === 'maintenance');
      const dailyLogs = workHistory.filter(item => item.type === 'daily-log');
      const safetyInspections = workHistory.filter(item => item.type === 'safety-inspection');

      const totalTasksCompleted = workHistory.filter(item => 
        ['completed', 'resolved', 'closed'].includes(item.status.toLowerCase())
      ).length;

      const totalDuration = workHistory
        .filter(item => item.duration)
        .reduce((sum, item) => sum + (item.duration || 0), 0);

      const averageCompletionTime = totalTasksCompleted > 0 ? totalDuration / totalTasksCompleted : 0;

      const lastActivityDate = workHistory.length > 0 && workHistory[0] ? new Date(workHistory[0].date) : undefined;

      // Calculate efficiency based on completion rate
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
        rating: Math.min(5, Math.max(1, Math.round((efficiency / 20) + 1))) // Convert efficiency to 1-5 rating
      };
    } catch (error) {
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

  // Helper method to generate comprehensive analytics
  static async generateEmployeeAnalytics(employeeId: string): Promise<any> {
    try {
      const workHistory = await EmployeeController.aggregateWorkHistory(employeeId);
      const performanceMetrics = await EmployeeController.calculatePerformanceMetrics(employeeId, workHistory);

      // Generate analytics data for charts
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
    } catch (error) {
      console.error('Error generating employee analytics:', error);
      return {};
    }
  }

  // Helper method to get filtered work history
  static async getFilteredWorkHistory(employeeId: string, filters: any): Promise<any> {
    try {
      const workHistory = await EmployeeController.aggregateWorkHistory(employeeId);

      let filteredHistory = workHistory;

      // Apply filters
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

      // Apply pagination
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
    } catch (error) {
      console.error('Error getting filtered work history:', error);
      return { items: [], pagination: {} };
    }
  }

  // Helper method to get monthly activity data for charts
  static getMonthlyActivityData(workHistory: IWorkHistoryEntry[]): any[] {
    const monthlyData = new Map();
    const currentDate = new Date();
    
    // Initialize last 12 months
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

    // Count activities by month
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

  // Helper method to get task distribution data
  static getTaskDistributionData(workHistory: IWorkHistoryEntry[]): any[] {
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

  // Helper method to get performance trends
  static getPerformanceTrends(workHistory: IWorkHistoryEntry[]): any[] {
    const trends = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const monthActivities = workHistory.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= date && itemDate < nextDate;
      });

      const completed = monthActivities.filter(item => 
        ['completed', 'resolved', 'closed'].includes(item.status.toLowerCase())
      ).length;

      trends.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        efficiency: monthActivities.length > 0 ? Math.round((completed / monthActivities.length) * 100) : 0,
        totalTasks: monthActivities.length,
        completedTasks: completed
      });
    }

    return trends;
  }

  // Helper method to get asset workload data
  static getAssetWorkloadData(workHistory: IWorkHistoryEntry[]): any[] {
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
      .slice(0, 10); // Top 10 assets
  }

  // Get employee statistics
  static async getEmployeeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await Employee.aggregate([
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
      const departmentStats = await Employee.aggregate([
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
      const roleStats = await Employee.aggregate([
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
    } catch (error: any) {
      console.error('Error fetching employee stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching employee statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
} 