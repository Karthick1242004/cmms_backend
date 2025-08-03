import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkHistoryEntry {
  date: Date;
  type: 'ticket' | 'maintenance' | 'daily-log' | 'safety-inspection';
  referenceId: string;
  title: string;
  description?: string;
  status: string;
  assetId?: string;
  assetName?: string;
  duration?: number; // hours
  priority?: string;
}

export interface IAssetAssignment {
  assetId: string;
  assetName: string;
  assignedDate: Date;
  unassignedDate?: Date;
  status: 'active' | 'completed' | 'transferred';
  role: 'primary' | 'secondary' | 'temporary';
  notes?: string;
}

export interface IPerformanceMetrics {
  totalTasksCompleted: number;
  averageCompletionTime: number; // hours
  ticketsResolved: number;
  maintenanceCompleted: number;
  safetyInspectionsCompleted: number;
  dailyLogEntries: number;
  lastActivityDate?: Date | undefined;
  efficiency: number; // percentage
  rating: number; // 1-5 scale
}

export interface IEmployee extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  
  // Extended fields for detailed tracking
  employeeId?: string; // Unique employee identifier
  joinDate?: Date;
  supervisor?: string; // Employee ID of supervisor
  skills?: string[]; // Array of skills/competencies
  certifications?: string[]; // Array of certifications
  workShift?: 'day' | 'night' | 'rotating' | 'on-call';
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Work history and assignments
  workHistory: IWorkHistoryEntry[];
  assetAssignments: IAssetAssignment[];
  currentAssignments: string[]; // Array of current asset IDs
  
  // Performance tracking
  performanceMetrics: IPerformanceMetrics;
  
  // Analytics data (computed fields)
  totalWorkHours?: number;
  productivityScore?: number;
  reliabilityScore?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const WorkHistorySchema = new Schema({
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['ticket', 'maintenance', 'daily-log', 'safety-inspection'],
    required: true 
  },
  referenceId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  assetId: { type: String },
  assetName: { type: String },
  duration: { type: Number }, // hours
  priority: { type: String }
});

const AssetAssignmentSchema = new Schema({
  assetId: { type: String, required: true },
  assetName: { type: String, required: true },
  assignedDate: { type: Date, required: true },
  unassignedDate: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'transferred'],
    default: 'active'
  },
  role: { 
    type: String, 
    enum: ['primary', 'secondary', 'temporary'],
    default: 'primary'
  },
  notes: { type: String }
});

const PerformanceMetricsSchema = new Schema({
  totalTasksCompleted: { type: Number, default: 0 },
  averageCompletionTime: { type: Number, default: 0 }, // hours
  ticketsResolved: { type: Number, default: 0 },
  maintenanceCompleted: { type: Number, default: 0 },
  safetyInspectionsCompleted: { type: Number, default: 0 },
  dailyLogEntries: { type: Number, default: 0 },
  lastActivityDate: { type: Date },
  efficiency: { type: Number, default: 0, min: 0, max: 100 }, // percentage
  rating: { type: Number, default: 3, min: 1, max: 5 } // 1-5 scale
});

const EmployeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      maxlength: [100, 'Employee name cannot exceed 100 characters'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[\+]?[\d\s\-\(\)]+$/,
        'Please enter a valid phone number'
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department name cannot exceed 100 characters'],
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be either active or inactive',
      },
      default: 'active',
      index: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: '/placeholder-user.jpg',
    },
    
    // Extended fields for detailed tracking
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    supervisor: {
      type: String, // Employee ID of supervisor
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    certifications: [{
      type: String,
      trim: true,
    }],
    workShift: {
      type: String,
      enum: ['day', 'night', 'rotating', 'on-call'],
      default: 'day',
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    
    // Work history and assignments
    workHistory: {
      type: [WorkHistorySchema],
      default: [],
    },
    assetAssignments: {
      type: [AssetAssignmentSchema],
      default: [],
    },
    currentAssignments: [{
      type: String, // Asset IDs
      trim: true,
    }],
    
    // Performance tracking
    performanceMetrics: {
      type: PerformanceMetricsSchema,
      default: () => ({}),
    },
    
    // Analytics data (computed fields)
    totalWorkHours: {
      type: Number,
      default: 0,
    },
    productivityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reliabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
EmployeeSchema.index({ name: 1, status: 1 });
EmployeeSchema.index({ department: 1, role: 1 });
EmployeeSchema.index({ email: 1, status: 1 });

// Virtual for full contact info
EmployeeSchema.virtual('contactInfo').get(function() {
  return `${this.name} - ${this.email} (${this.phone})`;
});

// Virtual for display name with department
EmployeeSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.department} (${this.role})`;
});

// Pre-save middleware to capitalize first letter of name and normalize data
EmployeeSchema.pre('save', function(next) {
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  if (this.department) {
    this.department = this.department.charAt(0).toUpperCase() + this.department.slice(1);
  }
  if (this.role) {
    this.role = this.role.charAt(0).toUpperCase() + this.role.slice(1);
  }
  next();
});

// Transform to frontend format
EmployeeSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee; 