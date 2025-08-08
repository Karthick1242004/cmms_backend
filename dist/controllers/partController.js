"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartController = void 0;
const Part_1 = __importDefault(require("../models/Part"));
const Asset_1 = __importDefault(require("../models/Asset"));
const mongoose_1 = require("mongoose");
class PartController {
    static async getAllParts(req, res) {
        try {
            const { page = 1, limit = 50, search, department, category, stockFilter, supplier, sortBy = 'name', sortOrder = 'asc' } = req.query;
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            let query = { status: 'active' };
            if (userRole === 'admin') {
                if (department && department !== 'all') {
                    query.$or = [
                        { department: department },
                        { 'linkedAssets.assetDepartment': department }
                    ];
                }
            }
            else if (userRole === 'manager' || userRole === 'technician') {
                query.$or = [
                    { department: userDepartment },
                    { 'linkedAssets.assetDepartment': userDepartment }
                ];
            }
            if (search) {
                const searchRegex = new RegExp(search.toString(), 'i');
                query.$and = [
                    ...(query.$and || []),
                    {
                        $or: [
                            { name: searchRegex },
                            { partNumber: searchRegex },
                            { sku: searchRegex },
                            { materialCode: searchRegex },
                            { supplier: searchRegex },
                            { description: searchRegex }
                        ]
                    }
                ];
            }
            if (category && category !== 'all') {
                query.category = category;
            }
            if (supplier && supplier !== 'all') {
                query.supplier = supplier;
            }
            if (stockFilter && stockFilter !== 'all') {
                if (stockFilter === 'low') {
                    query.$expr = { $lte: ['$quantity', '$minStockLevel'] };
                }
                else if (stockFilter === 'out') {
                    query.quantity = 0;
                }
                else if (stockFilter === 'normal') {
                    query.$expr = { $gt: ['$quantity', '$minStockLevel'] };
                }
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sort = {};
            sort[sortBy.toString()] = sortOrder === 'desc' ? -1 : 1;
            const [parts, totalCount] = await Promise.all([
                Part_1.default.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                Part_1.default.countDocuments(query)
            ]);
            const transformedParts = parts.map((part) => ({
                id: part._id.toString(),
                partNumber: part.partNumber,
                name: part.name,
                sku: part.sku,
                materialCode: part.materialCode,
                description: part.description,
                category: part.category,
                department: part.department,
                linkedAssets: part.linkedAssets || [],
                quantity: part.quantity,
                minStockLevel: part.minStockLevel,
                unitPrice: part.unitPrice,
                totalValue: part.totalValue,
                supplier: part.supplier,
                supplierCode: part.supplierCode,
                leadTime: part.leadTime,
                location: part.location,
                alternativeLocations: part.alternativeLocations || [],
                totalConsumed: part.totalConsumed,
                averageMonthlyUsage: part.averageMonthlyUsage,
                lastUsedDate: part.lastUsedDate,
                status: part.status,
                isStockItem: part.isStockItem,
                isCritical: part.isCritical,
                stockStatus: part.quantity <= 0 ? 'out_of_stock' :
                    part.quantity <= part.minStockLevel ? 'low_stock' : 'in_stock',
                departmentsServed: [...new Set((part.linkedAssets || []).map((asset) => asset.assetDepartment))],
                createdAt: part.createdAt,
                updatedAt: part.updatedAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    parts: transformedParts,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Parts retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching parts:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching parts',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getPartById(req, res) {
        try {
            const { id } = req.params;
            if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid part ID format'
                });
                return;
            }
            const part = await Part_1.default.findById(id).lean();
            if (!part) {
                res.status(404).json({
                    success: false,
                    message: 'Part not found'
                });
                return;
            }
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            if (userRole !== 'admin') {
                const hasAccess = part.department === userDepartment ||
                    part.linkedAssets?.some((asset) => asset.assetDepartment === userDepartment);
                if (!hasAccess) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied to this part'
                    });
                    return;
                }
            }
            const transformedPart = {
                id: part._id.toString(),
                partNumber: part.partNumber,
                name: part.name,
                sku: part.sku,
                materialCode: part.materialCode,
                description: part.description,
                category: part.category,
                department: part.department,
                linkedAssets: part.linkedAssets || [],
                quantity: part.quantity,
                minStockLevel: part.minStockLevel,
                unitPrice: part.unitPrice,
                totalValue: part.totalValue,
                supplier: part.supplier,
                supplierCode: part.supplierCode,
                leadTime: part.leadTime,
                location: part.location,
                alternativeLocations: part.alternativeLocations || [],
                totalConsumed: part.totalConsumed,
                averageMonthlyUsage: part.averageMonthlyUsage,
                lastUsedDate: part.lastUsedDate,
                status: part.status,
                isStockItem: part.isStockItem,
                isCritical: part.isCritical,
                stockStatus: part.quantity <= 0 ? 'out_of_stock' :
                    part.quantity <= part.minStockLevel ? 'low_stock' : 'in_stock',
                departmentsServed: [...new Set((part.linkedAssets || []).map((asset) => asset.assetDepartment))],
                createdAt: part.createdAt,
                updatedAt: part.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedPart,
                message: 'Part retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching part:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching part',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getPartsStats(req, res) {
        try {
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            let matchQuery = { status: 'active' };
            if (userRole !== 'admin') {
                matchQuery.$or = [
                    { department: userDepartment },
                    { 'linkedAssets.assetDepartment': userDepartment }
                ];
            }
            const [totalParts, lowStockParts, outOfStockParts, criticalParts, totalValue, categoryStats, departmentStats] = await Promise.all([
                Part_1.default.countDocuments(matchQuery),
                Part_1.default.countDocuments({
                    ...matchQuery,
                    $expr: { $lte: ['$quantity', '$minStockLevel'] }
                }),
                Part_1.default.countDocuments({
                    ...matchQuery,
                    quantity: 0
                }),
                Part_1.default.countDocuments({
                    ...matchQuery,
                    isCritical: true
                }),
                Part_1.default.aggregate([
                    { $match: matchQuery },
                    { $group: { _id: null, total: { $sum: '$totalValue' } } }
                ]),
                Part_1.default.aggregate([
                    { $match: matchQuery },
                    { $group: {
                            _id: '$category',
                            count: { $sum: 1 },
                            value: { $sum: '$totalValue' }
                        } },
                    { $sort: { count: -1 } }
                ]),
                Part_1.default.aggregate([
                    { $match: matchQuery },
                    { $group: {
                            _id: '$department',
                            count: { $sum: 1 },
                            value: { $sum: '$totalValue' }
                        } },
                    { $sort: { count: -1 } }
                ])
            ]);
            res.status(200).json({
                success: true,
                data: {
                    overview: {
                        totalParts,
                        lowStockParts,
                        outOfStockParts,
                        criticalParts,
                        totalValue: totalValue[0]?.total || 0
                    },
                    categoryBreakdown: categoryStats,
                    departmentBreakdown: departmentStats
                },
                message: 'Parts statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching parts stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching parts statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async syncPartsFromAssets(req, res) {
        try {
            console.log('🔄 Starting parts sync from assets...');
            const assets = await Asset_1.default.find({
                deleted: { $ne: 'Yes' },
                partsBOM: { $exists: true, $not: { $size: 0 } }
            }).lean();
            let syncedCount = 0;
            let createdCount = 0;
            let updatedCount = 0;
            for (const asset of assets) {
                if (!asset.partsBOM || asset.partsBOM.length === 0)
                    continue;
                for (const bomPart of asset.partsBOM) {
                    if (!bomPart.partNumber || !bomPart.partName)
                        continue;
                    try {
                        let existingPart = await Part_1.default.findOne({
                            partNumber: bomPart.partNumber
                        });
                        const assetLink = {
                            assetId: asset._id.toString(),
                            assetName: asset.assetName,
                            assetDepartment: asset.department,
                            quantityInAsset: bomPart.quantity || 1,
                            lastUsed: bomPart.lastReplaced,
                            criticalLevel: 'medium'
                        };
                        if (existingPart) {
                            const assetExists = existingPart.linkedAssets?.some(link => link.assetId === asset._id.toString());
                            if (!assetExists) {
                                await Part_1.default.findByIdAndUpdate(existingPart._id, {
                                    $push: { linkedAssets: assetLink }
                                });
                                updatedCount++;
                            }
                        }
                        else {
                            const newPart = new Part_1.default({
                                partNumber: bomPart.partNumber,
                                name: bomPart.partName,
                                sku: `SKU-${bomPart.partNumber}`,
                                materialCode: `MAT-${bomPart.partNumber}`,
                                description: `Part from asset: ${asset.assetName}`,
                                category: 'General',
                                department: asset.department,
                                linkedAssets: [assetLink],
                                quantity: 0,
                                minStockLevel: 5,
                                unitPrice: bomPart.unitCost || 0,
                                supplier: bomPart.supplier || 'Unknown',
                                location: asset.location || 'Main Warehouse',
                                status: 'active',
                                isStockItem: true,
                                isCritical: false
                            });
                            await newPart.save();
                            createdCount++;
                        }
                        syncedCount++;
                    }
                    catch (partError) {
                        console.error(`Error syncing part ${bomPart.partNumber}:`, partError);
                    }
                }
            }
            res.status(200).json({
                success: true,
                data: {
                    totalAssetsProcessed: assets.length,
                    syncedCount,
                    createdCount,
                    updatedCount
                },
                message: `Parts sync completed. Created: ${createdCount}, Updated: ${updatedCount}`
            });
        }
        catch (error) {
            console.error('Error syncing parts from assets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while syncing parts',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.PartController = PartController;
exports.default = PartController;
