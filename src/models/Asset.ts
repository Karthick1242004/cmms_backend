import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  _id: string;
  assetName: string;
  serialNo?: string;
  rfid?: string;
  parentAsset?: string;
  productName?: string;
  categoryName?: string;
  statusText: string;
  statusColor?: 'green' | 'yellow' | 'red';
  assetClass?: string;
  constructionYear?: number;
  warrantyStart?: string;
  manufacturer?: string;
  outOfOrder?: 'Yes' | 'No';
  isActive?: 'Yes' | 'No';
  category: string; // Main category: Equipment, Facilities, Products, Tools
  department: string; // Department that owns/manages this asset
  size?: string;
  costPrice?: number;
  productionHoursDaily?: number;
  serviceStatus?: string;
  description?: string;
  lastEnquiryDate?: string;
  productionTime?: string;
  lineNumber?: string;
  assetType?: string; // e.g., Tangible, Fixed Asset, Consumable
  commissioningDate?: string;
  endOfWarranty?: string;
  expectedLifeSpan?: number;
  deleted?: 'Yes' | 'No';
  allocated?: string;
  allocatedOn?: string;
  uom?: string;
  salesPrice?: number;
  lastEnquiryBy?: string;
  shelfLifeInMonth?: number;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'new';
  imageSrc?: string;
  partsBOM?: any[];
  meteringEvents?: any[];
  personnel?: any[];
  warrantyDetails?: any;
  businesses?: any[];
  files?: any[];
  financials?: any;
  purchaseInfo?: any;
  associatedCustomer?: any;
  log?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    assetName: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
      maxlength: [200, 'Asset name cannot exceed 200 characters'],
      index: true,
    },
    serialNo: {
      type: String,
      trim: true,
      maxlength: [100, 'Serial number cannot exceed 100 characters'],
      index: true,
    },
    rfid: {
      type: String,
      trim: true,
      maxlength: [100, 'RFID cannot exceed 100 characters'],
      index: true,
    },
    parentAsset: {
      type: String,
      trim: true,
      maxlength: [200, 'Parent asset cannot exceed 200 characters'],
    },
    productName: {
      type: String,
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    categoryName: {
      type: String,
      trim: true,
      maxlength: [200, 'Category name cannot exceed 200 characters'],
      index: true,
    },
    statusText: {
      type: String,
      required: [true, 'Status is required'],
      trim: true,
      maxlength: [50, 'Status cannot exceed 50 characters'],
      index: true,
    },
    statusColor: {
      type: String,
      enum: {
        values: ['green', 'yellow', 'red'],
        message: 'Status color must be green, yellow, or red',
      },
    },
    assetClass: {
      type: String,
      trim: true,
      maxlength: [100, 'Asset class cannot exceed 100 characters'],
    },
    constructionYear: {
      type: Number,
      min: [1900, 'Construction year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Construction year cannot be more than 10 years in future'],
    },
    warrantyStart: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
      maxlength: [200, 'Manufacturer cannot exceed 200 characters'],
      index: true,
    },
    outOfOrder: {
      type: String,
      enum: {
        values: ['Yes', 'No'],
        message: 'Out of order must be Yes or No',
      },
      default: 'No',
    },
    isActive: {
      type: String,
      enum: {
        values: ['Yes', 'No'],
        message: 'Is active must be Yes or No',
      },
      default: 'Yes',
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Equipment', 'Facilities', 'Products', 'Tools'],
        message: 'Category must be Equipment, Facilities, Products, or Tools',
      },
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
      index: true,
    },
    size: {
      type: String,
      trim: true,
      maxlength: [50, 'Size cannot exceed 50 characters'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative'],
    },
    productionHoursDaily: {
      type: Number,
      min: [0, 'Production hours cannot be negative'],
      max: [24, 'Production hours cannot exceed 24 hours'],
    },
    serviceStatus: {
      type: String,
      trim: true,
      maxlength: [100, 'Service status cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    lastEnquiryDate: {
      type: String,
      trim: true,
    },
    productionTime: {
      type: String,
      trim: true,
      maxlength: [100, 'Production time cannot exceed 100 characters'],
    },
    lineNumber: {
      type: String,
      trim: true,
      maxlength: [100, 'Line number cannot exceed 100 characters'],
    },
    assetType: {
      type: String,
      trim: true,
      maxlength: [100, 'Asset type cannot exceed 100 characters'],
    },
    commissioningDate: {
      type: String,
      trim: true,
    },
    endOfWarranty: {
      type: String,
      trim: true,
    },
    expectedLifeSpan: {
      type: Number,
      min: [0, 'Expected life span cannot be negative'],
      max: [100, 'Expected life span cannot exceed 100 years'],
    },
    deleted: {
      type: String,
      enum: {
        values: ['Yes', 'No'],
        message: 'Deleted must be Yes or No',
      },
      default: 'No',
      index: true,
    },
    allocated: {
      type: String,
      trim: true,
      maxlength: [200, 'Allocated cannot exceed 200 characters'],
    },
    allocatedOn: {
      type: String,
      trim: true,
    },
    uom: {
      type: String,
      trim: true,
      maxlength: [50, 'UoM cannot exceed 50 characters'],
    },
    salesPrice: {
      type: Number,
      min: [0, 'Sales price cannot be negative'],
    },
    lastEnquiryBy: {
      type: String,
      trim: true,
      maxlength: [200, 'Last enquiry by cannot exceed 200 characters'],
    },
    shelfLifeInMonth: {
      type: Number,
      min: [0, 'Shelf life cannot be negative'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
      index: true,
    },
    purchaseDate: {
      type: String,
      trim: true,
    },
    purchasePrice: {
      type: Number,
      min: [0, 'Purchase price cannot be negative'],
    },
    condition: {
      type: String,
      enum: {
        values: ['excellent', 'good', 'fair', 'poor', 'new'],
        message: 'Condition must be excellent, good, fair, poor, or new',
      },
      index: true,
    },
    imageSrc: {
      type: String,
      trim: true,
      default: '/placeholder.svg?height=150&width=250',
    },
    partsBOM: [{
      id: String,
      partName: String,
      partNumber: String,
      quantity: Number,
      unitCost: Number,
      supplier: String,
      lastReplaced: String,
    }],
    meteringEvents: [{
      id: String,
      eventType: String,
      reading: Number,
      unit: String,
      recordedDate: String,
      recordedBy: String,
    }],
    personnel: [{
      id: String,
      name: String,
      role: String,
      email: String,
      phone: String,
      assignedDate: String,
    }],
    warrantyDetails: {
      provider: String,
      type: String,
      startDate: String,
      endDate: String,
      coverage: String,
      terms: String,
      contactInfo: String,
      claimHistory: [{
        claimNumber: String,
        date: String,
        issue: String,
        status: String,
        cost: Number,
      }],
    },
    businesses: [{
      id: String,
      name: String,
      type: String,
      contactPerson: String,
      phone: String,
    }],
    files: [{
      id: String,
      name: String,
      type: String,
      size: String,
      uploadDate: String,
      uploadedBy: String,
    }],
    financials: {
      totalCostOfOwnership: Number,
      annualOperatingCost: Number,
      depreciationRate: Number,
      currentBookValue: Number,
      maintenanceCostYTD: Number,
      fuelCostYTD: Number,
    },
    purchaseInfo: {
      purchaseOrderNumber: String,
      vendor: String,
      purchaseDate: String,
      deliveryDate: String,
      terms: String,
      discount: Number,
      totalCost: Number,
    },
    associatedCustomer: {
      id: String,
      name: String,
      type: String,
      contactPerson: String,
      phone: String,
    },
    log: [{
      id: String,
      date: String,
      action: String,
      performedBy: String,
      notes: String,
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
AssetSchema.index({ assetName: 1, department: 1 });
AssetSchema.index({ category: 1, status: 1 });
AssetSchema.index({ serialNo: 1, rfid: 1 });
AssetSchema.index({ manufacturer: 1, condition: 1 });
AssetSchema.index({ location: 1, isActive: 1 });
AssetSchema.index({ department: 1, category: 1, deleted: 1 });

// Virtual for display name with category
AssetSchema.virtual('displayName').get(function() {
  return `${this.assetName} - ${this.category} (${this.serialNo || 'No Serial'})`;
});

// Virtual for status display
AssetSchema.virtual('statusDisplay').get(function() {
  return `${this.statusText} (${this.condition || 'Unknown condition'})`;
});

// Pre-save middleware to normalize data
AssetSchema.pre('save', function(next) {
  if (this.assetName) {
    this.assetName = this.assetName.trim();
  }
  if (this.department) {
    this.department = this.department.charAt(0).toUpperCase() + this.department.slice(1);
  }
  if (this.category) {
    this.category = this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }
  next();
});

// Transform to frontend format
AssetSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Asset = mongoose.model<IAsset>('Asset', AssetSchema);

export default Asset; 