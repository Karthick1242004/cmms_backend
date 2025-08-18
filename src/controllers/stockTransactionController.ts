import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import StockTransaction, { IStockTransaction } from '../models/StockTransaction';
import Part from '../models/Part';
import { Types } from 'mongoose';

export class StockTransactionController {
  // Get all stock transactions with filtering
  static async getAllTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        department,
        transactionType,
        status,
        priority,
        dateFrom,
        dateTo,
        partId,
        createdBy,
        sortBy = 'transactionDate',
        sortOrder = 'desc'
      } = req.query;

      // Build query based on user's department access
      const userDepartment = req.user?.department;
      const userRole = req.user?.role;
      
      let query: any = {};

      // Department filtering based on user role
      // Per requirements: stock transactions can be seen by all users
      // Only apply department filter if specifically requested via query parameter
      if (department && department !== 'all') {
        query.department = department;
      }

      // Apply filters
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

      // Date range filtering
      if (dateFrom || dateTo) {
        query.transactionDate = {};
        if (dateFrom) {
          query.transactionDate.$gte = new Date(dateFrom.toString());
        }
        if (dateTo) {
          query.transactionDate.$lte = new Date(dateTo.toString());
        }
      }

      // Calculate skip for pagination
      const skip = (Number(page) - 1) * Number(limit);

      // Build sort object
      const sort: any = {};
      sort[sortBy.toString()] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const [transactions, totalCount] = await Promise.all([
        StockTransaction.find(query)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        StockTransaction.countDocuments(query)
      ]);

      // Transform transactions data for frontend
      const transformedTransactions = transactions.map((transaction: any) => ({
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
        totalQuantity: transaction.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
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
    } catch (error: any) {
      console.error('Error fetching stock transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching stock transactions',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get transaction by ID
  static async getTransactionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid transaction ID format'
        });
        return;
      }

      const transaction = await StockTransaction.findById(id).lean();

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Stock transaction not found'
        });
        return;
      }

      // Check department access
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
    } catch (error: any) {
      console.error('Error fetching stock transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching stock transaction',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Create new stock transaction
  static async createTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        transactionType,
        transactionDate,
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
        items,
        priority = 'normal',
        notes,
        internalNotes
      } = req.body;

      // Validate required fields
      if (!transactionType || !transactionDate || !description || !items || items.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Transaction type, date, description, and at least one item are required'
        });
        return;
      }

      // Validate items
      for (const item of items) {
        if (!item.partId || !item.partNumber || !item.partName || !item.quantity || item.quantity <= 0) {
          res.status(400).json({
            success: false,
            message: 'Each item must have partId, partNumber, partName, and valid quantity'
          });
          return;
        }
      }

      // For issue transactions, validate stock availability
      if (transactionType === 'issue' || transactionType === 'transfer_out') {
        for (const item of items) {
          const part = await Part.findById(item.partId);
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

      // Get user information
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

      // Calculate item costs
      const processedItems = await Promise.all(items.map(async (item: any) => {
        const part = await Part.findById(item.partId).lean();
        const unitCost = item.unitCost || part?.unitPrice || 0;
        const totalCost = item.quantity * unitCost;

        return {
          ...item,
          unitCost,
          totalCost
        };
      }));

      // Create new transaction
      const newTransaction = new StockTransaction({
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

      // Transform for response
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
    } catch (error: any) {
      console.error('Error creating stock transaction:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
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

  // Update transaction status (approve, complete, cancel)
  static async updateTransactionStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!id || !Types.ObjectId.isValid(id)) {
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

      // Find existing transaction
      const existingTransaction = await StockTransaction.findById(id);
      if (!existingTransaction) {
        res.status(404).json({
          success: false,
          message: 'Stock transaction not found'
        });
        return;
      }

      // Check access permissions
      const userDepartment = req.user?.department;
      const userRole = req.user?.role;
      const userId = req.user?.id;
      const userName = req.user?.name;
      
      // Only admin (super_admin) and manager (department lead) can edit transactions
      if (userRole !== 'admin' && userRole !== 'manager') {
        res.status(403).json({
          success: false,
          message: 'Access denied. Only admins and managers can edit transactions'
        });
        return;
      }
      
      // Managers can only edit transactions from their department
      if (userRole === 'manager' && existingTransaction.department !== userDepartment) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Managers can only edit transactions from their department'
        });
        return;
      }

      // Check permission for status changes
      // Note: Only admins and managers can reach this point due to earlier validation
      // Additional approval logic can be added here if needed

      // Prepare update data
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (notes) {
        updateData.notes = notes;
      }

      // Handle approval
      if (status === 'approved') {
        updateData.approvedBy = userId;
        updateData.approvedByName = userName;
        updateData.approvedAt = new Date();
      }

      // Handle completion - update part quantities
      if (status === 'completed') {
        for (const item of existingTransaction.items) {
          const part = await Part.findById(item.partId);
          if (part) {
            let newQuantity = part.quantity;
            
            // Adjust quantities based on transaction type
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
                // For adjustments, the quantity in the item represents the final quantity
                newQuantity = item.quantity;
                break;
            }

            // Update part quantity and consumption tracking
            const updateFields: any = { quantity: Math.max(0, newQuantity) };
            
            if (['issue', 'transfer_out', 'scrap'].includes(existingTransaction.transactionType)) {
              updateFields.totalConsumed = (part.totalConsumed || 0) + item.quantity;
              updateFields.lastUsedDate = new Date().toISOString();
            }

            await Part.findByIdAndUpdate(item.partId, updateFields);
          }
        }
      }

      // Update the transaction
      const updatedTransaction = await StockTransaction.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedTransaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found after update'
        });
        return;
      }

      // Transform for response
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
    } catch (error: any) {
      console.error('Error updating transaction status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating transaction status',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get transaction statistics
  static async getTransactionStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userDepartment = req.user?.department;
      const userRole = req.user?.role;
      
      let matchQuery: any = {};

      // Apply department filtering
      if (userRole !== 'admin') {
        matchQuery.department = userDepartment;
      }

      const [
        totalTransactions,
        pendingTransactions,
        completedTransactions,
        totalValue,
        transactionsByType,
        transactionsByStatus,
        recentTransactions
      ] = await Promise.all([
        StockTransaction.countDocuments(matchQuery),
        StockTransaction.countDocuments({ ...matchQuery, status: 'pending' }),
        StockTransaction.countDocuments({ ...matchQuery, status: 'completed' }),
        StockTransaction.aggregate([
          { $match: { ...matchQuery, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        StockTransaction.aggregate([
          { $match: matchQuery },
          { $group: { 
            _id: '$transactionType', 
            count: { $sum: 1 },
            value: { $sum: '$totalAmount' }
          }},
          { $sort: { count: -1 } }
        ]),
        StockTransaction.aggregate([
          { $match: matchQuery },
          { $group: { 
            _id: '$status', 
            count: { $sum: 1 }
          }},
          { $sort: { count: -1 } }
        ]),
        StockTransaction.find(matchQuery)
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
          recentTransactions: recentTransactions.map((transaction: any) => ({
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
    } catch (error: any) {
      console.error('Error fetching transaction stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching transaction statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Delete transaction (only drafts can be deleted)
  static async deleteTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid transaction ID format'
        });
        return;
      }

      // Find existing transaction
      const existingTransaction = await StockTransaction.findById(id);
      if (!existingTransaction) {
        res.status(404).json({
          success: false,
          message: 'Stock transaction not found'
        });
        return;
      }

      // Check access permissions
      const userDepartment = req.user?.department;
      const userRole = req.user?.role;
      
      // Only admin (super_admin) and manager (department lead) can delete transactions
      if (userRole !== 'admin' && userRole !== 'manager') {
        res.status(403).json({
          success: false,
          message: 'Access denied. Only admins and managers can delete transactions'
        });
        return;
      }
      
      // Managers can only delete transactions from their department
      if (userRole === 'manager' && existingTransaction.department !== userDepartment) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Managers can only delete transactions from their department'
        });
        return;
      }

      // Only allow deletion of draft transactions
      if (existingTransaction.status !== 'draft') {
        res.status(400).json({
          success: false,
          message: 'Only draft transactions can be deleted'
        });
        return;
      }

      // Delete the transaction
      await StockTransaction.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Stock transaction deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting transaction',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}

export default StockTransactionController;
