"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const express_validator_1 = require("express-validator");
const Asset_1 = __importDefault(require("../models/Asset"));
class AssetController {
    // Get all assets with optional filtering and pagination
    static async getAllAssets(req, res) {
        try {
            const { page = 1, limit = 10, search, category, status, department, condition, manufacturer, location, sortBy = 'assetName', sortOrder = 'asc' } = req.query;
            const query = {};
            // Exclude deleted assets by default
            query.deleted = { $ne: 'Yes' };
            if (category && category !== 'all') {
                query.category = category;
            }
            if (status && status !== 'all') {
                query.statusText = { $regex: status, $options: 'i' };
            }
            if (department && department !== 'all') {
                query.department = { $regex: department, $options: 'i' };
            }
            if (condition && condition !== 'all') {
                query.condition = condition;
            }
            if (manufacturer && manufacturer !== 'all') {
                query.manufacturer = { $regex: manufacturer, $options: 'i' };
            }
            if (location && location !== 'all') {
                query.location = { $regex: location, $options: 'i' };
            }
            if (search) {
                query.$or = [
                    { assetName: { $regex: search, $options: 'i' } },
                    { serialNo: { $regex: search, $options: 'i' } },
                    { rfid: { $regex: search, $options: 'i' } },
                    { productName: { $regex: search, $options: 'i' } },
                    { categoryName: { $regex: search, $options: 'i' } },
                    { manufacturer: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            // Calculate pagination
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            // Execute query with pagination
            const [assets, totalCount] = await Promise.all([
                Asset_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                Asset_1.default.countDocuments(query)
            ]);
            // Transform for frontend compatibility
            const transformedAssets = assets.map(asset => ({
                id: asset._id.toString(),
                assetName: asset.assetName,
                serialNo: asset.serialNo,
                rfid: asset.rfid,
                parentAsset: asset.parentAsset,
                productName: asset.productName,
                categoryName: asset.categoryName,
                statusText: asset.statusText,
                statusColor: asset.statusColor,
                assetClass: asset.assetClass,
                constructionYear: asset.constructionYear,
                warrantyStart: asset.warrantyStart,
                manufacturer: asset.manufacturer,
                outOfOrder: asset.outOfOrder,
                isActive: asset.isActive,
                category: asset.category,
                department: asset.department,
                size: asset.size,
                costPrice: asset.costPrice,
                productionHoursDaily: asset.productionHoursDaily,
                serviceStatus: asset.serviceStatus,
                description: asset.description,
                lastEnquiryDate: asset.lastEnquiryDate,
                productionTime: asset.productionTime,
                lineNumber: asset.lineNumber,
                assetType: asset.assetType,
                commissioningDate: asset.commissioningDate,
                endOfWarranty: asset.endOfWarranty,
                expectedLifeSpan: asset.expectedLifeSpan,
                deleted: asset.deleted,
                allocated: asset.allocated,
                allocatedOn: asset.allocatedOn,
                uom: asset.uom,
                salesPrice: asset.salesPrice,
                lastEnquiryBy: asset.lastEnquiryBy,
                shelfLifeInMonth: asset.shelfLifeInMonth,
                location: asset.location,
                purchaseDate: asset.purchaseDate,
                purchasePrice: asset.purchasePrice,
                condition: asset.condition,
                imageSrc: asset.imageSrc,
                partsBOM: asset.partsBOM,
                meteringEvents: asset.meteringEvents,
                personnel: asset.personnel,
                warrantyDetails: asset.warrantyDetails,
                businesses: asset.businesses,
                files: asset.files,
                financials: asset.financials,
                purchaseInfo: asset.purchaseInfo,
                associatedCustomer: asset.associatedCustomer,
                log: asset.log,
                createdAt: asset.createdAt,
                updatedAt: asset.updatedAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    assets: transformedAssets,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Assets retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching assets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching assets',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    // Get asset by ID
    static async getAssetById(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset_1.default.findById(id).lean();
            if (!asset || asset.deleted === 'Yes') {
                res.status(404).json({
                    success: false,
                    message: 'Asset not found'
                });
                return;
            }
            // Transform for frontend compatibility
            const transformedAsset = {
                id: asset._id.toString(),
                assetName: asset.assetName,
                serialNo: asset.serialNo,
                rfid: asset.rfid,
                parentAsset: asset.parentAsset,
                productName: asset.productName,
                categoryName: asset.categoryName,
                statusText: asset.statusText,
                statusColor: asset.statusColor,
                assetClass: asset.assetClass,
                constructionYear: asset.constructionYear,
                warrantyStart: asset.warrantyStart,
                manufacturer: asset.manufacturer,
                outOfOrder: asset.outOfOrder,
                isActive: asset.isActive,
                category: asset.category,
                department: asset.department,
                size: asset.size,
                costPrice: asset.costPrice,
                productionHoursDaily: asset.productionHoursDaily,
                serviceStatus: asset.serviceStatus,
                description: asset.description,
                lastEnquiryDate: asset.lastEnquiryDate,
                productionTime: asset.productionTime,
                lineNumber: asset.lineNumber,
                assetType: asset.assetType,
                commissioningDate: asset.commissioningDate,
                endOfWarranty: asset.endOfWarranty,
                expectedLifeSpan: asset.expectedLifeSpan,
                deleted: asset.deleted,
                allocated: asset.allocated,
                allocatedOn: asset.allocatedOn,
                uom: asset.uom,
                salesPrice: asset.salesPrice,
                lastEnquiryBy: asset.lastEnquiryBy,
                shelfLifeInMonth: asset.shelfLifeInMonth,
                location: asset.location,
                purchaseDate: asset.purchaseDate,
                purchasePrice: asset.purchasePrice,
                condition: asset.condition,
                imageSrc: asset.imageSrc,
                partsBOM: asset.partsBOM,
                meteringEvents: asset.meteringEvents,
                personnel: asset.personnel,
                warrantyDetails: asset.warrantyDetails,
                businesses: asset.businesses,
                files: asset.files,
                financials: asset.financials,
                purchaseInfo: asset.purchaseInfo,
                associatedCustomer: asset.associatedCustomer,
                log: asset.log,
                createdAt: asset.createdAt,
                updatedAt: asset.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedAsset,
                message: 'Asset retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching asset:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching asset',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    // Create new asset
    static async createAsset(req, res) {
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
            const assetData = req.body;
            // Check if asset with same serial number already exists (if serial number provided)
            if (assetData.serialNo) {
                const existingAsset = await Asset_1.default.findOne({
                    serialNo: assetData.serialNo,
                    deleted: { $ne: 'Yes' }
                });
                if (existingAsset) {
                    res.status(409).json({
                        success: false,
                        message: 'Asset with this serial number already exists'
                    });
                    return;
                }
            }
            // Create new asset
            const asset = new Asset_1.default(assetData);
            const savedAsset = await asset.save();
            res.status(201).json({
                success: true,
                data: savedAsset.toJSON(),
                message: 'Asset created successfully'
            });
        }
        catch (error) {
            console.error('Error creating asset:', error);
            // Handle duplicate key error
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: 'Asset with this serial number already exists'
                });
                return;
            }
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err) => {
                    if (err.kind === 'required') {
                        return `${err.path} is required`;
                    }
                    else if (err.kind === 'enum') {
                        return `${err.path} must be one of: ${err.properties.enumValues.join(', ')}`;
                    }
                    else if (err.kind === 'maxlength') {
                        return `${err.path} cannot exceed ${err.properties.maxlength} characters`;
                    }
                    else if (err.kind === 'min') {
                        return `${err.path} must be at least ${err.properties.min}`;
                    }
                    else if (err.kind === 'max') {
                        return `${err.path} cannot exceed ${err.properties.max}`;
                    }
                    else {
                        return `${err.path}: ${err.message}`;
                    }
                });
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating asset',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Update asset
    static async updateAsset(req, res) {
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
            // Check if asset exists
            const existingAsset = await Asset_1.default.findById(id);
            if (!existingAsset || existingAsset.deleted === 'Yes') {
                res.status(404).json({
                    success: false,
                    message: 'Asset not found'
                });
                return;
            }
            // If serial number is being updated, check for duplicates
            if (updates.serialNo && updates.serialNo !== existingAsset.serialNo) {
                const duplicateAsset = await Asset_1.default.findOne({
                    serialNo: updates.serialNo,
                    _id: { $ne: id },
                    deleted: { $ne: 'Yes' }
                });
                if (duplicateAsset) {
                    res.status(409).json({
                        success: false,
                        message: 'Asset with this serial number already exists'
                    });
                    return;
                }
            }
            // Update asset
            const updatedAsset = await Asset_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
            if (!updatedAsset) {
                res.status(404).json({
                    success: false,
                    message: 'Asset not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    id: updatedAsset._id.toString(),
                    ...updatedAsset
                },
                message: 'Asset updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating asset:', error);
            if (error.code === 11000) {
                res.status(409).json({
                    success: false,
                    message: 'Asset with this serial number already exists'
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating asset',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    // Delete asset (soft delete)
    static async deleteAsset(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset_1.default.findById(id);
            if (!asset || asset.deleted === 'Yes') {
                res.status(404).json({
                    success: false,
                    message: 'Asset not found'
                });
                return;
            }
            // Soft delete by setting deleted flag
            const deletedAsset = await Asset_1.default.findByIdAndUpdate(id, { $set: { deleted: 'Yes', isActive: 'No' } }, { new: true });
            res.status(200).json({
                success: true,
                message: 'Asset deleted successfully',
                data: {
                    id: deletedAsset._id.toString(),
                    assetName: deletedAsset.assetName,
                    serialNo: deletedAsset.serialNo
                }
            });
        }
        catch (error) {
            console.error('Error deleting asset:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting asset',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    // Get asset statistics
    static async getAssetStats(req, res) {
        try {
            const stats = await Asset_1.default.aggregate([
                {
                    $match: { deleted: { $ne: 'Yes' } }
                },
                {
                    $group: {
                        _id: null,
                        totalAssets: { $sum: 1 },
                        activeAssets: {
                            $sum: { $cond: [{ $eq: ['$isActive', 'Yes'] }, 1, 0] }
                        },
                        inactiveAssets: {
                            $sum: { $cond: [{ $eq: ['$isActive', 'No'] }, 1, 0] }
                        },
                        operationalAssets: {
                            $sum: { $cond: [{ $regex: ['$statusText', /operational|online/i] }, 1, 0] }
                        },
                        maintenanceAssets: {
                            $sum: { $cond: [{ $regex: ['$statusText', /maintenance/i] }, 1, 0] }
                        },
                        averageCostPrice: { $avg: '$costPrice' },
                        totalValue: { $sum: '$costPrice' }
                    }
                }
            ]);
            // Get category breakdown
            const categoryStats = await Asset_1.default.aggregate([
                {
                    $match: { deleted: { $ne: 'Yes' } }
                },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        activeCount: {
                            $sum: { $cond: [{ $eq: ['$isActive', 'Yes'] }, 1, 0] }
                        },
                        totalValue: { $sum: '$costPrice' }
                    }
                },
                { $sort: { count: -1 } }
            ]);
            // Get department breakdown
            const departmentStats = await Asset_1.default.aggregate([
                {
                    $match: { deleted: { $ne: 'Yes' } }
                },
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 },
                        totalValue: { $sum: '$costPrice' }
                    }
                },
                { $sort: { count: -1 } }
            ]);
            // Get condition breakdown
            const conditionStats = await Asset_1.default.aggregate([
                {
                    $match: { deleted: { $ne: 'Yes' } }
                },
                {
                    $group: {
                        _id: '$condition',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);
            // Get manufacturer breakdown (top 10)
            const manufacturerStats = await Asset_1.default.aggregate([
                {
                    $match: {
                        deleted: { $ne: 'Yes' },
                        manufacturer: { $nin: [null, ''] }
                    }
                },
                {
                    $group: {
                        _id: '$manufacturer',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            const result = stats[0] || {
                totalAssets: 0,
                activeAssets: 0,
                inactiveAssets: 0,
                operationalAssets: 0,
                maintenanceAssets: 0,
                averageCostPrice: 0,
                totalValue: 0
            };
            result.categoryBreakdown = categoryStats;
            result.departmentBreakdown = departmentStats;
            result.conditionBreakdown = conditionStats;
            result.manufacturerBreakdown = manufacturerStats;
            res.status(200).json({
                success: true,
                data: result,
                message: 'Asset statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching asset stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching asset statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    // Bulk import assets
    static async bulkImportAssets(req, res) {
        try {
            const { assets } = req.body;
            if (!Array.isArray(assets) || assets.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Assets array is required and cannot be empty'
                });
                return;
            }
            // Validate that each asset has required fields
            const invalidAssets = assets.filter(asset => !asset.assetName || !asset.category || !asset.department);
            if (invalidAssets.length > 0) {
                res.status(400).json({
                    success: false,
                    message: 'All assets must have assetName, category, and department',
                    invalidCount: invalidAssets.length
                });
                return;
            }
            // Check for duplicate serial numbers in the import
            const serialNumbers = assets
                .filter(asset => asset.serialNo)
                .map(asset => asset.serialNo);
            const uniqueSerialNumbers = [...new Set(serialNumbers)];
            if (serialNumbers.length !== uniqueSerialNumbers.length) {
                res.status(400).json({
                    success: false,
                    message: 'Duplicate serial numbers found in import data'
                });
                return;
            }
            // Check for existing serial numbers in database
            if (uniqueSerialNumbers.length > 0) {
                const existingAssets = await Asset_1.default.find({
                    serialNo: { $in: uniqueSerialNumbers },
                    deleted: { $ne: 'Yes' }
                }).select('serialNo');
                if (existingAssets.length > 0) {
                    res.status(409).json({
                        success: false,
                        message: 'Some assets with these serial numbers already exist',
                        existingSerialNumbers: existingAssets.map(a => a.serialNo)
                    });
                    return;
                }
            }
            // Bulk insert assets
            const createdAssets = await Asset_1.default.insertMany(assets);
            res.status(201).json({
                success: true,
                data: {
                    importedCount: createdAssets.length,
                    assets: createdAssets.map(asset => asset.toJSON())
                },
                message: `Successfully imported ${createdAssets.length} assets`
            });
        }
        catch (error) {
            console.error('Error bulk importing assets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while importing assets',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.AssetController = AssetController;
//# sourceMappingURL=assetController.js.map