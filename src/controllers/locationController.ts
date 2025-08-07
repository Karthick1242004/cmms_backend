import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Location, { ILocation } from '../models/Location';

export class LocationController {
  // Get all locations with optional filtering and pagination
  static async getAllLocations(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        department,
        type,
        sortBy = 'name', 
        sortOrder = 'asc' 
      } = req.query;

      // Build query
      const query: any = {};
      
      if (status && status !== 'all') {
        query.status = status;
      }

      if (department && department !== 'all') {
        query.department = department;
      }

      if (type && type !== 'all') {
        query.type = type;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);
      const sortDirection = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const [locations, totalCount] = await Promise.all([
        Location.find(query)
          .sort({ [sortBy as string]: sortDirection })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Location.countDocuments(query)
      ]);

      // Transform for frontend compatibility
      const transformedLocations = locations.map(location => ({
        id: location._id.toString(),
        name: location.name,
        code: location.code,
        type: location.type,
        description: location.description,
        department: location.department,
        parentLocation: location.parentLocation,
        assetCount: location.assetCount,
        address: location.address,
        status: location.status,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt
      }));

      res.status(200).json({
        success: true,
        data: {
          locations: transformedLocations,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalCount / Number(limit)),
            totalCount,
            hasNext: skip + Number(limit) < totalCount,
            hasPrevious: Number(page) > 1
          }
        },
        message: 'Locations retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching locations',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get location by ID
  static async getLocationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const location = await Location.findById(id).lean();

      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Location not found'
        });
        return;
      }

      // Transform for frontend compatibility
      const transformedLocation = {
        id: location._id.toString(),
        name: location.name,
        code: location.code,
        type: location.type,
        description: location.description,
        department: location.department,
        parentLocation: location.parentLocation,
        assetCount: location.assetCount,
        address: location.address,
        status: location.status,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt
      };

      res.status(200).json({
        success: true,
        data: transformedLocation,
        message: 'Location retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching location:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching location',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Create new location
  static async createLocation(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const locationData = req.body;

      // Check if location code already exists
      const existingLocation = await Location.findOne({ code: locationData.code });
      if (existingLocation) {
        res.status(400).json({
          success: false,
          message: 'Location code already exists'
        });
        return;
      }

      const newLocation = new Location(locationData);
      const savedLocation = await newLocation.save();

      // Transform for frontend compatibility
      const transformedLocation = {
        id: savedLocation._id.toString(),
        name: savedLocation.name,
        code: savedLocation.code,
        type: savedLocation.type,
        description: savedLocation.description,
        department: savedLocation.department,
        parentLocation: savedLocation.parentLocation,
        assetCount: savedLocation.assetCount,
        address: savedLocation.address,
        status: savedLocation.status,
        createdAt: savedLocation.createdAt,
        updatedAt: savedLocation.updatedAt
      };

      res.status(201).json({
        success: true,
        data: transformedLocation,
        message: 'Location created successfully'
      });
    } catch (error: any) {
      console.error('Error creating location:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while creating location',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Update location
  static async updateLocation(req: Request, res: Response): Promise<void> {
    try {
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
      const updateData = req.body;

      // Check if location exists
      const existingLocation = await Location.findById(id);
      if (!existingLocation) {
        res.status(404).json({
          success: false,
          message: 'Location not found'
        });
        return;
      }

      // Check if code is being updated and if it already exists
      if (updateData.code && updateData.code !== existingLocation.code) {
        const codeExists = await Location.findOne({ 
          code: updateData.code, 
          _id: { $ne: id } 
        });
        if (codeExists) {
          res.status(400).json({
            success: false,
            message: 'Location code already exists'
          });
          return;
        }
      }

      const updatedLocation = await Location.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedLocation) {
        res.status(404).json({
          success: false,
          message: 'Location not found'
        });
        return;
      }

      // Transform for frontend compatibility
      const transformedLocation = {
        id: updatedLocation._id.toString(),
        name: updatedLocation.name,
        code: updatedLocation.code,
        type: updatedLocation.type,
        description: updatedLocation.description,
        department: updatedLocation.department,
        parentLocation: updatedLocation.parentLocation,
        assetCount: updatedLocation.assetCount,
        address: updatedLocation.address,
        status: updatedLocation.status,
        createdAt: updatedLocation.createdAt,
        updatedAt: updatedLocation.updatedAt
      };

      res.status(200).json({
        success: true,
        data: transformedLocation,
        message: 'Location updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating location:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating location',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Delete location
  static async deleteLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const location = await Location.findById(id);
      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Location not found'
        });
        return;
      }

      // Check if location has assets
      if (location.assetCount > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete location with assets. Please reassign assets first.'
        });
        return;
      }

      await Location.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Location deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting location:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting location',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get location statistics
  static async getLocationStats(req: Request, res: Response): Promise<void> {
    try {
      const [totalLocations, activeLocations, inactiveLocations, typeStats, departmentStats] = await Promise.all([
        Location.countDocuments(),
        Location.countDocuments({ status: 'active' }),
        Location.countDocuments({ status: 'inactive' }),
        Location.aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Location.aggregate([
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
      ]);

      const totalAssets = await Location.aggregate([
        { $group: { _id: null, total: { $sum: '$assetCount' } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalLocations,
          activeLocations,
          inactiveLocations,
          totalAssets: totalAssets[0]?.total || 0,
          typeStats,
          departmentStats
        },
        message: 'Location statistics retrieved successfully'
      });
    } catch (error: any) {
      console.error('Error fetching location stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching location statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
} 