"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransactionController = void 0;
const StockTransaction_1 = __importDefault(require("../models/StockTransaction"));
const Part_1 = __importDefault(require("../models/Part"));
const mongoose_1 = require("mongoose");
class StockTransactionController {
    static async getAllTransactions(req, res) {
        try {
            const { page = 1, limit = 20, search, department, transactionType, status, priority, dateFrom, dateTo, partId, createdBy, sortBy = 'transactionDate', sortOrder = 'desc' } = req.query;
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            let query = {};
            if (department && department !== 'all') {
                query.department = department;
            }
            if (search) {
                const searchRegex = new RegExp(search.toString(), 'i');
                query.$or = [
                    { transactionNumber: searchRegex },
                    { referenceNumber: searchRegex },
                    { description: searchRegex },
                    { 'items.partNumber': searchRegex },
                    { 'items.partName': searchRegex },
                    { recipient: searchRegex },
                    { supplier: searchRegex },
                    { assetName: searchRegex },
                    { workOrderNumber: searchRegex }
                ];
            }
            if (transactionType && transactionType !== 'all') {
                query.transactionType = transactionType;
            }
            if (status && status !== 'all') {
                query.status = status;
            }
            if (priority && priority !== 'all') {
                query.priority = priority;
            }
            if (createdBy && createdBy !== 'all') {
                query.createdBy = createdBy;
            }
            if (partId) {
                query['items.partId'] = partId;
            }
            if (dateFrom || dateTo) {
                query.transactionDate = {};
                if (dateFrom) {
                    query.transactionDate.$gte = new Date(dateFrom.toString());
                }
                if (dateTo) {
                    query.transactionDate.$lte = new Date(dateTo.toString());
                }
            }
            const skip = (Number(page) - 1) * Number(limit);
            const sort = {};
            sort[sortBy.toString()] = sortOrder === 'desc' ? -1 : 1;
            const [transactions, totalCount] = await Promise.all([
                StockTransaction_1.default.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                StockTransaction_1.default.countDocuments(query)
            ]);
            const transformedTransactions = transactions.map((transaction) => ({
                id: transaction._id.toString(),
                transactionNumber: transaction.transactionNumber,
                transactionType: transaction.transactionType,
                transactionTypeDisplay: transaction.transactionTypeDisplay,
                transactionDate: transaction.transactionDate,
                referenceNumber: transaction.referenceNumber,
                description: transaction.description,
                sourceLocation: transaction.sourceLocation,
                destinationLocation: transaction.destinationLocation,
                supplier: transaction.supplier,
                recipient: transaction.recipient,
                recipientType: transaction.recipientType,
                assetId: transaction.assetId,
                assetName: transaction.assetName,
                workOrderId: transaction.workOrderId,
                workOrderNumber: transaction.workOrderNumber,
                items: transaction.items || [],
                totalAmount: transaction.totalAmount,
                currency: transaction.currency,
                createdBy: transaction.createdBy,
                createdByName: transaction.createdByName,
                department: transaction.department,
                approvedBy: transaction.approvedBy,
                approvedByName: transaction.approvedByName,
                approvedAt: transaction.approvedAt,
                status: transaction.status,
                statusDisplay: transaction.statusDisplay,
                priority: transaction.priority,
                attachments: transaction.attachments || [],
                notes: transaction.notes,
                internalNotes: userRole === 'admin' || userRole === 'manager' ? transaction.internalNotes : undefined,
                totalItems: transaction.items?.length || 0,
                totalQuantity: transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    transactions: transformedTransactions,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: skip + Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1
                    }
                },
                message: 'Stock transactions retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching stock transactions:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching stock transactions',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid transaction ID format'
                });
                return;
            }
            const transaction = await StockTransaction_1.default.findById(id).lean();
            if (!transaction) {
                res.status(404).json({
                    success: false,
                    message: 'Stock transaction not found'
                });
                return;
            }
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            if (userRole !== 'admin' && transaction.department !== userDepartment) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied to this stock transaction'
                });
                return;
            }
            const transformedTransaction = {
                id: transaction._id.toString(),
                transactionNumber: transaction.transactionNumber,
                transactionType: transaction.transactionType,
                transactionDate: transaction.transactionDate,
                referenceNumber: transaction.referenceNumber,
                description: transaction.description,
                sourceLocation: transaction.sourceLocation,
                destinationLocation: transaction.destinationLocation,
                supplier: transaction.supplier,
                recipient: transaction.recipient,
                recipientType: transaction.recipientType,
                assetId: transaction.assetId,
                assetName: transaction.assetName,
                workOrderId: transaction.workOrderId,
                workOrderNumber: transaction.workOrderNumber,
                items: transaction.items || [],
                totalAmount: transaction.totalAmount,
                currency: transaction.currency,
                createdBy: transaction.createdBy,
                createdByName: transaction.createdByName,
                department: transaction.department,
                approvedBy: transaction.approvedBy,
                approvedByName: transaction.approvedByName,
                approvedAt: transaction.approvedAt,
                status: transaction.status,
                priority: transaction.priority,
                attachments: transaction.attachments || [],
                notes: transaction.notes,
                internalNotes: userRole === 'admin' || userRole === 'manager' ? transaction.internalNotes : undefined,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedTransaction,
                message: 'Stock transaction retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching stock transaction:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching stock transaction',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async createTransaction(req, res) {
        try {
            const { transactionType, transactionDate, referenceNumber, description, sourceLocation, destinationLocation, supplier, recipient, recipientType, assetId, assetName, workOrderId, workOrderNumber, items, priority = 'normal', notes, internalNotes } = req.body;
            if (!transactionType || !transactionDate || !description || !items || items.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Transaction type, date, description, and at least one item are required'
                });
                return;
            }
            for (const item of items) {
                if (!item.partId || !item.partNumber || !item.partName || !item.quantity || item.quantity <= 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Each item must have partId, partNumber, partName, and valid quantity'
                    });
                    return;
                }
            }
            if (transactionType === 'issue' || transactionType === 'transfer_out') {
                for (const item of items) {
                    const part = await Part_1.default.findById(item.partId);
                    if (!part) {
                        res.status(404).json({
                            success: false,
                            message: `Part not found: ${item.partName} (${item.partNumber})`
                        });
                        return;
                    }
                    if (part.quantity < item.quantity) {
                        res.status(400).json({
                            success: false,
                            message: `Insufficient stock for ${item.partName}. Available: ${part.quantity}, Requested: ${item.quantity}`
                        });
                        return;
                    }
                }
            }
            const userDepartment = req.user?.department;
            const userId = req.user?.id;
            const userName = req.user?.name;
            if (!userDepartment || !userId || !userName) {
                res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
                return;
            }
            const processedItems = await Promise.all(items.map(async (item) => {
                const part = await Part_1.default.findById(item.partId).lean();
                const unitCost = item.unitCost || part?.unitPrice || 0;
                const totalCost = item.quantity * unitCost;
                return {
                    ...item,
                    unitCost,
                    totalCost
                };
            }));
            const newTransaction = new StockTransaction_1.default({
                transactionType,
                transactionDate: new Date(transactionDate),
                referenceNumber,
                description,
                sourceLocation,
                destinationLocation,
                supplier,
                recipient,
                recipientType,
                assetId,
                assetName,
                workOrderId,
                workOrderNumber,
                items: processedItems,
                createdBy: userId,
                createdByName: userName,
                department: userDepartment,
                status: 'draft',
                priority,
                notes,
                internalNotes
            });
            const savedTransaction = await newTransaction.save();
            const transformedTransaction = {
                id: savedTransaction._id.toString(),
                transactionNumber: savedTransaction.transactionNumber,
                transactionType: savedTransaction.transactionType,
                transactionDate: savedTransaction.transactionDate,
                referenceNumber: savedTransaction.referenceNumber,
                description: savedTransaction.description,
                sourceLocation: savedTransaction.sourceLocation,
                destinationLocation: savedTransaction.destinationLocation,
                supplier: savedTransaction.supplier,
                recipient: savedTransaction.recipient,
                recipientType: savedTransaction.recipientType,
                assetId: savedTransaction.assetId,
                assetName: savedTransaction.assetName,
                workOrderId: savedTransaction.workOrderId,
                workOrderNumber: savedTransaction.workOrderNumber,
                items: savedTransaction.items,
                totalAmount: savedTransaction.totalAmount,
                currency: savedTransaction.currency,
                createdBy: savedTransaction.createdBy,
                createdByName: savedTransaction.createdByName,
                department: savedTransaction.department,
                status: savedTransaction.status,
                priority: savedTransaction.priority,
                notes: savedTransaction.notes,
                internalNotes: savedTransaction.internalNotes,
                createdAt: savedTransaction.createdAt,
                updatedAt: savedTransaction.updatedAt
            };
            res.status(201).json({
                success: true,
                data: transformedTransaction,
                message: 'Stock transaction created successfully'
            });
        }
        catch (error) {
            console.error('Error creating stock transaction:', error);
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err) => err.message);
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: validationErrors
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating stock transaction',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async updateTransactionStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;
            if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid transaction ID format'
                });
                return;
            }
            if (!status || !['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Valid status is required (pending, approved, completed, cancelled)'
                });
                return;
            }
            const existingTransaction = await StockTransaction_1.default.findById(id);
            if (!existingTransaction) {
                res.status(404).json({
                    success: false,
                    message: 'Stock transaction not found'
                });
                return;
            }
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            const userId = req.user?.id;
            const userName = req.user?.name;
            if (userRole !== 'admin' && userRole !== 'manager') {
                res.status(403).json({
                    success: false,
                    message: 'Access denied. Only admins and managers can edit transactions'
                });
                return;
            }
            if (userRole === 'manager' && existingTransaction.department !== userDepartment) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied. Managers can only edit transactions from their department'
                });
                return;
            }
            const updateData = {
                status,
                updatedAt: new Date()
            };
            if (notes) {
                updateData.notes = notes;
            }
            if (status === 'approved') {
                updateData.approvedBy = userId;
                updateData.approvedByName = userName;
                updateData.approvedAt = new Date();
            }
            if (status === 'completed') {
                for (const item of existingTransaction.items) {
                    const part = await Part_1.default.findById(item.partId);
                    if (part) {
                        let newQuantity = part.quantity;
                        switch (existingTransaction.transactionType) {
                            case 'receipt':
                            case 'transfer_in':
                                newQuantity += item.quantity;
                                break;
                            case 'issue':
                            case 'transfer_out':
                            case 'scrap':
                                newQuantity -= item.quantity;
                                break;
                            case 'adjustment':
                                newQuantity = item.quantity;
                                break;
                        }
                        const updateFields = { quantity: Math.max(0, newQuantity) };
                        if (['issue', 'transfer_out', 'scrap'].includes(existingTransaction.transactionType)) {
                            updateFields.totalConsumed = (part.totalConsumed || 0) + item.quantity;
                            updateFields.lastUsedDate = new Date().toISOString();
                        }
                        await Part_1.default.findByIdAndUpdate(item.partId, updateFields);
                    }
                }
            }
            const updatedTransaction = await StockTransaction_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            if (!updatedTransaction) {
                res.status(404).json({
                    success: false,
                    message: 'Transaction not found after update'
                });
                return;
            }
            const transformedTransaction = {
                id: updatedTransaction._id.toString(),
                transactionNumber: updatedTransaction.transactionNumber,
                transactionType: updatedTransaction.transactionType,
                transactionDate: updatedTransaction.transactionDate,
                referenceNumber: updatedTransaction.referenceNumber,
                description: updatedTransaction.description,
                sourceLocation: updatedTransaction.sourceLocation,
                destinationLocation: updatedTransaction.destinationLocation,
                supplier: updatedTransaction.supplier,
                recipient: updatedTransaction.recipient,
                recipientType: updatedTransaction.recipientType,
                assetId: updatedTransaction.assetId,
                assetName: updatedTransaction.assetName,
                workOrderId: updatedTransaction.workOrderId,
                workOrderNumber: updatedTransaction.workOrderNumber,
                items: updatedTransaction.items,
                totalAmount: updatedTransaction.totalAmount,
                currency: updatedTransaction.currency,
                createdBy: updatedTransaction.createdBy,
                createdByName: updatedTransaction.createdByName,
                department: updatedTransaction.department,
                approvedBy: updatedTransaction.approvedBy,
                approvedByName: updatedTransaction.approvedByName,
                approvedAt: updatedTransaction.approvedAt,
                status: updatedTransaction.status,
                priority: updatedTransaction.priority,
                notes: updatedTransaction.notes,
                internalNotes: userRole === 'admin' || userRole === 'manager' ? updatedTransaction.internalNotes : undefined,
                createdAt: updatedTransaction.createdAt,
                updatedAt: updatedTransaction.updatedAt
            };
            res.status(200).json({
                success: true,
                data: transformedTransaction,
                message: `Transaction ${status} successfully`
            });
        }
        catch (error) {
            console.error('Error updating transaction status:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating transaction status',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async getTransactionStats(req, res) {
        try {
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            let matchQuery = {};
            if (userRole !== 'admin') {
                matchQuery.department = userDepartment;
            }
            const [totalTransactions, pendingTransactions, completedTransactions, totalValue, transactionsByType, transactionsByStatus, recentTransactions] = await Promise.all([
                StockTransaction_1.default.countDocuments(matchQuery),
                StockTransaction_1.default.countDocuments({ ...matchQuery, status: 'pending' }),
                StockTransaction_1.default.countDocuments({ ...matchQuery, status: 'completed' }),
                StockTransaction_1.default.aggregate([
                    { $match: { ...matchQuery, status: 'completed' } },
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
                ]),
                StockTransaction_1.default.aggregate([
                    { $match: matchQuery },
                    { $group: {
                            _id: '$transactionType',
                            count: { $sum: 1 },
                            value: { $sum: '$totalAmount' }
                        } },
                    { $sort: { count: -1 } }
                ]),
                StockTransaction_1.default.aggregate([
                    { $match: matchQuery },
                    { $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        } },
                    { $sort: { count: -1 } }
                ]),
                StockTransaction_1.default.find(matchQuery)
                    .sort({ transactionDate: -1 })
                    .limit(5)
                    .lean()
            ]);
            res.status(200).json({
                success: true,
                data: {
                    overview: {
                        totalTransactions,
                        pendingTransactions,
                        completedTransactions,
                        totalValue: totalValue[0]?.total || 0
                    },
                    transactionsByType,
                    transactionsByStatus,
                    recentTransactions: recentTransactions.map((transaction) => ({
                        id: transaction._id.toString(),
                        transactionNumber: transaction.transactionNumber,
                        transactionType: transaction.transactionType,
                        transactionDate: transaction.transactionDate,
                        description: transaction.description,
                        status: transaction.status,
                        totalAmount: transaction.totalAmount,
                        itemCount: transaction.items?.length || 0
                    }))
                },
                message: 'Stock transaction statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching transaction stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching transaction statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    static async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid transaction ID format'
                });
                return;
            }
            const existingTransaction = await StockTransaction_1.default.findById(id);
            if (!existingTransaction) {
                res.status(404).json({
                    success: false,
                    message: 'Stock transaction not found'
                });
                return;
            }
            const userDepartment = req.user?.department;
            const userRole = req.user?.role;
            if (userRole !== 'admin' && userRole !== 'manager') {
                res.status(403).json({
                    success: false,
                    message: 'Access denied. Only admins and managers can delete transactions'
                });
                return;
            }
            if (userRole === 'manager' && existingTransaction.department !== userDepartment) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied. Managers can only delete transactions from their department'
                });
                return;
            }
            if (existingTransaction.status !== 'draft') {
                res.status(400).json({
                    success: false,
                    message: 'Only draft transactions can be deleted'
                });
                return;
            }
            await StockTransaction_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: 'Stock transaction deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting transaction:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting transaction',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.StockTransactionController = StockTransactionController;
exports.default = StockTransactionController;
