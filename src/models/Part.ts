import mongoose, { Document, Schema } from 'mongoose';

export interface IPart extends Document {
  _id: string;
  partNumber: string;
  name: string;
  sku: string;
  materialCode: string;
  description?: string;
  category: string;
  department: string; // Department that manages this part
  
  // Asset references - this is the key optimization
  linkedAssets: Array<{
    assetId: string;
    assetName: string;
    assetDepartment: string;
    quantityInAsset: number;
    lastUsed?: string;
    replacementFrequency?: number; // in days
    criticalLevel?: 'low' | 'medium' | 'high';
  }>;
  
  // Inventory management
  quantity: number; // Total available stock
  minStockLevel: number;
  unitPrice: number;
  totalValue: number; // calculated field
  
  // Supply chain
  supplier: string;
  supplierCode?: string;
  leadTime?: number; // in days
  lastPurchaseDate?: string;
  lastPurchasePrice?: number;
  
  // Location & Storage
  location: string; // Primary storage location
  alternativeLocations?: string[];
  
  // Usage tracking
  totalConsumed: number; // lifetime consumption
  averageMonthlyUsage: number;
  lastUsedDate?: string;
  
  // Status & metadata
  status: 'active' | 'inactive' | 'discontinued';
  isStockItem: boolean; // true for parts, false for one-time items
  isCritical: boolean; // business critical part
  
  createdAt: Date;
  updatedAt: Date;
}

const PartSchema = new Schema<IPart>(
  {
    partNumber: {
      type: String,
      required: [true, 'Part number is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Part number cannot exceed 50 characters'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
      maxlength: [200, 'Part name cannot exceed 200 characters'],
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
      index: true,
    },
    materialCode: {
      type: String,
      required: [true, 'Material code is required'],
      trim: true,
      maxlength: [50, 'Material code cannot exceed 50 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
      index: true,
    },
    linkedAssets: [{
      assetId: {
        type: String,
        required: true,
        index: true,
      },
      assetName: {
        type: String,
        required: true,
        trim: true,
      },
      assetDepartment: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      quantityInAsset: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
      },
      lastUsed: {
        type: String,
        trim: true,
      },
      replacementFrequency: {
        type: Number,
        min: [0, 'Replacement frequency cannot be negative'],
      },
      criticalLevel: {
        type: String,
        enum: {
          values: ['low', 'medium', 'high'],
          message: 'Critical level must be low, medium, or high',
        },
        default: 'medium',
      },
    }],
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      index: true,
    },
    minStockLevel: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock level cannot be negative'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalValue: {
      type: Number,
      default: function() {
        return this.quantity * this.unitPrice;
      },
    },
    supplier: {
      type: String,
      required: [true, 'Supplier is required'],
      trim: true,
      maxlength: [200, 'Supplier cannot exceed 200 characters'],
      index: true,
    },
    supplierCode: {
      type: String,
      trim: true,
      maxlength: [50, 'Supplier code cannot exceed 50 characters'],
    },
    leadTime: {
      type: Number,
      min: [0, 'Lead time cannot be negative'],
    },
    lastPurchaseDate: {
      type: String,
      trim: true,
    },
    lastPurchasePrice: {
      type: Number,
      min: [0, 'Last purchase price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
      index: true,
    },
    alternativeLocations: [{
      type: String,
      trim: true,
      maxlength: [200, 'Alternative location cannot exceed 200 characters'],
    }],
    totalConsumed: {
      type: Number,
      default: 0,
      min: [0, 'Total consumed cannot be negative'],
    },
    averageMonthlyUsage: {
      type: Number,
      default: 0,
      min: [0, 'Average monthly usage cannot be negative'],
    },
    lastUsedDate: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'discontinued'],
        message: 'Status must be active, inactive, or discontinued',
      },
      default: 'active',
      index: true,
    },
    isStockItem: {
      type: Boolean,
      default: true,
      index: true,
    },
    isCritical: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimal querying
PartSchema.index({ department: 1, status: 1 });
PartSchema.index({ 'linkedAssets.assetDepartment': 1 });
PartSchema.index({ quantity: 1, minStockLevel: 1 }); // For low stock queries
PartSchema.index({ category: 1, department: 1 });
PartSchema.index({ totalValue: -1 }); // For high-value parts
PartSchema.index({ isCritical: 1, quantity: 1 }); // For critical low stock alerts

// Virtual for stock status
PartSchema.virtual('stockStatus').get(function() {
  if (this.quantity <= 0) return 'out_of_stock';
  if (this.quantity <= this.minStockLevel) return 'low_stock';
  return 'in_stock';
});

// Virtual for departments served (from linked assets)
PartSchema.virtual('departmentsServed').get(function() {
  const departments = this.linkedAssets?.map(asset => asset.assetDepartment) || [];
  return [...new Set(departments)];
});

// Pre-save middleware to calculate total value
PartSchema.pre('save', function(next) {
  this.totalValue = this.quantity * this.unitPrice;
  next();
});

// Static method to get parts by department (including parts used by assets in that department)
PartSchema.statics.getPartsByDepartment = function(department: string) {
  return this.find({
    $or: [
      { department: department }, // Parts managed by this department
      { 'linkedAssets.assetDepartment': department } // Parts used by assets in this department
    ],
    status: 'active'
  });
};

// Static method to get parts by asset
PartSchema.statics.getPartsByAsset = function(assetId: string) {
  return this.find({
    'linkedAssets.assetId': assetId,
    status: 'active'
  });
};

// Static method to get low stock parts
PartSchema.statics.getLowStockParts = function(department?: string) {
  const query: any = {
    $expr: { $lte: ['$quantity', '$minStockLevel'] },
    status: 'active'
  };
  
  if (department) {
    query.$or = [
      { department: department },
      { 'linkedAssets.assetDepartment': department }
    ];
  }
  
  return this.find(query);
};

const Part = mongoose.model<IPart>('Part', PartSchema);

export default Part;