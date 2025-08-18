import mongoose, { Document, Schema } from 'mongoose';

export interface IStockTransactionItem {
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  fromLocation?: string;
  toLocation?: string;
  notes?: string;
}

export interface IStockTransaction extends Document {
  _id: string;
  transactionNumber: string; // Auto-generated unique transaction number
  transactionType: 'receipt' | 'issue' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'scrap';
  transactionDate: Date;
  referenceNumber?: string; // PO#, Work Order #, etc.
  description: string;
  
  // Source/Destination Information
  sourceLocation?: string;
  destinationLocation?: string;
  supplier?: string;
  recipient?: string; // Employee, Department, Work Order
  recipientType?: 'employee' | 'department' | 'work_order' | 'asset' | 'other';
  
  // Asset/Work Order References
  assetId?: string;
  assetName?: string;
  workOrderId?: string;
  workOrderNumber?: string;
  
  // Items in this transaction
  items: IStockTransactionItem[];
  
  // Financial Information
  totalAmount?: number;
  currency?: string;
  
  // Metadata
  createdBy: string; // Employee ID
  createdByName: string; // Employee Name
  department: string; // Department responsible for this transaction
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Date;
  
  // Status and workflow
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Additional Information
  attachments?: Array<{
    filename: string;
    fileType: string;
    fileSize: number;
    url: string;
    uploadedAt: Date;
  }>;
  
  notes?: string;
  internalNotes?: string; // Only visible to managers/admins
  
  createdAt: Date;
  updatedAt: Date;
}

const StockTransactionItemSchema = new Schema<IStockTransactionItem>({
  partId: {
    type: String,
    required: [true, 'Part ID is required'],
    index: true,
  },
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    trim: true,
    maxlength: [50, 'Part number cannot exceed 50 characters'],
    index: true,
  },
  partName: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true,
    maxlength: [200, 'Part name cannot exceed 200 characters'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0'],
  },
  unitCost: {
    type: Number,
    min: [0, 'Unit cost cannot be negative'],
  },
  totalCost: {
    type: Number,
    min: [0, 'Total cost cannot be negative'],
  },
  fromLocation: {
    type: String,
    trim: true,
    maxlength: [200, 'From location cannot exceed 200 characters'],
  },
  toLocation: {
    type: String,
    trim: true,
    maxlength: [200, 'To location cannot exceed 200 characters'],
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
}, { _id: false });

const StockTransactionSchema = new Schema<IStockTransaction>(
  {
    transactionNumber: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [20, 'Transaction number cannot exceed 20 characters'],
      index: true,
    },
    transactionType: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['receipt', 'issue', 'transfer_in', 'transfer_out', 'adjustment', 'scrap'],
        message: 'Transaction type must be one of: receipt, issue, transfer_in, transfer_out, adjustment, scrap',
      },
      index: true,
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
      index: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Reference number cannot exceed 50 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    sourceLocation: {
      type: String,
      trim: true,
      maxlength: [200, 'Source location cannot exceed 200 characters'],
      index: true,
    },
    destinationLocation: {
      type: String,
      trim: true,
      maxlength: [200, 'Destination location cannot exceed 200 characters'],
      index: true,
    },
    supplier: {
      type: String,
      trim: true,
      maxlength: [200, 'Supplier cannot exceed 200 characters'],
      index: true,
    },
    recipient: {
      type: String,
      trim: true,
      maxlength: [200, 'Recipient cannot exceed 200 characters'],
      index: true,
    },
    recipientType: {
      type: String,
      enum: {
        values: ['employee', 'department', 'work_order', 'asset', 'other'],
        message: 'Recipient type must be one of: employee, department, work_order, asset, other',
      },
      index: true,
    },
    assetId: {
      type: String,
      trim: true,
      index: true,
    },
    assetName: {
      type: String,
      trim: true,
      maxlength: [200, 'Asset name cannot exceed 200 characters'],
    },
    workOrderId: {
      type: String,
      trim: true,
      index: true,
    },
    workOrderNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Work order number cannot exceed 50 characters'],
    },
    items: {
      type: [StockTransactionItemSchema],
      required: [true, 'At least one item is required'],
      validate: {
        validator: function(items: IStockTransactionItem[]) {
          return items && items.length > 0;
        },
        message: 'Transaction must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      maxlength: [3, 'Currency code cannot exceed 3 characters'],
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
      trim: true,
      index: true,
    },
    createdByName: {
      type: String,
      required: [true, 'Created by name is required'],
      trim: true,
      maxlength: [200, 'Created by name cannot exceed 200 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
      index: true,
    },
    approvedBy: {
      type: String,
      trim: true,
      index: true,
    },
    approvedByName: {
      type: String,
      trim: true,
      maxlength: [200, 'Approved by name cannot exceed 200 characters'],
    },
    approvedAt: {
      type: Date,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['draft', 'pending', 'approved', 'completed', 'cancelled'],
        message: 'Status must be one of: draft, pending, approved, completed, cancelled',
      },
      default: 'draft',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'normal', 'high', 'urgent'],
        message: 'Priority must be one of: low, normal, high, urgent',
      },
      default: 'normal',
      index: true,
    },
    attachments: [{
      filename: {
        type: String,
        required: true,
        trim: true,
        maxlength: [255, 'Filename cannot exceed 255 characters'],
      },
      fileType: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'File type cannot exceed 50 characters'],
      },
      fileSize: {
        type: Number,
        required: true,
        min: [0, 'File size cannot be negative'],
      },
      url: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'URL cannot exceed 500 characters'],
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    internalNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Internal notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimal querying
StockTransactionSchema.index({ transactionNumber: 1 });
StockTransactionSchema.index({ transactionType: 1, status: 1 });
StockTransactionSchema.index({ department: 1, status: 1 });
StockTransactionSchema.index({ transactionDate: -1 });
StockTransactionSchema.index({ createdBy: 1, transactionDate: -1 });
StockTransactionSchema.index({ 'items.partId': 1 });
StockTransactionSchema.index({ 'items.partNumber': 1 });
StockTransactionSchema.index({ assetId: 1 });
StockTransactionSchema.index({ workOrderId: 1 });
StockTransactionSchema.index({ sourceLocation: 1 });
StockTransactionSchema.index({ destinationLocation: 1 });
StockTransactionSchema.index({ status: 1, priority: 1 });

// Virtual for formatted transaction type
StockTransactionSchema.virtual('transactionTypeDisplay').get(function() {
  const typeMap = {
    'receipt': 'Stock Receipt',
    'issue': 'Stock Issue',
    'transfer_in': 'Transfer In',
    'transfer_out': 'Transfer Out',
    'adjustment': 'Stock Adjustment',
    'scrap': 'Scrap/Disposal'
  };
  return typeMap[this.transactionType] || this.transactionType;
});

// Virtual for status display
StockTransactionSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'draft': 'Draft',
    'pending': 'Pending Approval',
    'approved': 'Approved',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for total items count
StockTransactionSchema.virtual('totalItems').get(function() {
  return this.items?.length || 0;
});

// Virtual for total quantity
StockTransactionSchema.virtual('totalQuantity').get(function() {
  return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
});

// Pre-save middleware to generate transaction number
StockTransactionSchema.pre('save', async function(next) {
  if (this.isNew && !this.transactionNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Count transactions for this month to generate sequence
    const count = await mongoose.model('StockTransaction').countDocuments({
      transactionNumber: new RegExp(`^ST${year}${month}`)
    });
    
    const sequence = (count + 1).toString().padStart(4, '0');
    this.transactionNumber = `ST${year}${month}${sequence}`;
  }
  
  // Calculate total amount if not provided
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((sum, item) => {
      return sum + (item.totalCost || (item.quantity * (item.unitCost || 0)));
    }, 0);
  }
  
  next();
});

// Static method to get transactions by department
StockTransactionSchema.statics.getTransactionsByDepartment = function(department: string, options: any = {}) {
  const query = { department, ...options };
  return this.find(query).sort({ transactionDate: -1 });
};

// Static method to get transactions by part
StockTransactionSchema.statics.getTransactionsByPart = function(partId: string) {
  return this.find({ 'items.partId': partId }).sort({ transactionDate: -1 });
};

// Static method to get pending approvals
StockTransactionSchema.statics.getPendingApprovals = function(department?: string) {
  const query: any = { status: 'pending' };
  if (department) {
    query.department = department;
  }
  return this.find(query).sort({ transactionDate: 1 });
};

const StockTransaction = mongoose.model<IStockTransaction>('StockTransaction', StockTransactionSchema);

export default StockTransaction;