import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Shift information interface
export interface IShiftInfo {
  shiftType: 'day' | 'night' | 'rotating' | 'on-call';
  shiftStartTime: string; // Format: "HH:MM"
  shiftEndTime: string; // Format: "HH:MM"
  workDays: string[]; // Array of days: ["Monday", "Tuesday", ...]
  location: string; // Work location
  effectiveDate?: Date; // When this shift assignment starts
}

export interface IEmployee extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  
  // Authentication
  password: string; // Hashed password for login
  lastLoginAt?: Date;
  
  // Extended fields for detailed tracking
  employeeId?: string; // Unique employee identifier
  joinDate?: Date;
  supervisor?: string; // Employee ID of supervisor
  skills?: string[]; // Array of skills/competencies
  certifications?: string[]; // Array of certifications
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Shift information (unified from ShiftDetail)
  shiftInfo?: IShiftInfo;
  
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
  
  // User access levels (for authentication)
  accessLevel?: 'super_admin' | 'department_admin' | 'normal_user';
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
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

const ShiftInfoSchema = new Schema({
  shiftType: {
    type: String,
    enum: ['day', 'night', 'rotating', 'on-call'],
    required: true
  },
  shiftStartTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  shiftEndTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  workDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: []
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  }
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
        values: ['active', 'inactive', 'on-leave'],
        message: 'Status must be active, inactive, or on-leave',
      },
      default: 'active',
      index: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: '/placeholder-user.jpg',
    },
    
    // Authentication
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    lastLoginAt: {
      type: Date,
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
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    
    // Shift information (unified from ShiftDetail)
    shiftInfo: {
      type: ShiftInfoSchema,
      default: null,
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
    
    // User access levels (for authentication)
    accessLevel: {
      type: String,
      enum: ['super_admin', 'department_admin', 'normal_user'],
      default: 'normal_user',
      index: true,
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

// Pre-save middleware to hash password and normalize data
EmployeeSchema.pre('save', async function(next) {
  try {
    // Hash password if it's modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Normalize name fields
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
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
EmployeeSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Transform to frontend format
EmployeeSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never expose password in JSON responses
    return ret;
  },
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee; 