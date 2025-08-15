import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IShiftInfo {
  shiftType: 'day' | 'night' | 'rotating' | 'on-call';
  shiftStartTime: string; // Format: "HH:MM"
  shiftEndTime: string; // Format: "HH:MM"
  workDays: string[]; // Array of days: ["Monday", "Tuesday", ...]
  location: string; // Work location
  effectiveDate?: Date; // When this shift assignment starts
}

export interface IWorkHistoryEntry {
  date: Date;
  type: 'ticket' | 'maintenance' | 'daily-log' | 'safety-inspection';
  referenceId: string;
  title: string;
  description?: string;
  status: string;
  assetId?: string;
  assetName?: string;
  priority?: string;
  duration?: number;
}

export interface IAssetAssignment {
  assetId: string;
  assetName: string;
  assignedDate: Date;
  endDate?: Date;
  role: string;
  isActive: boolean;
}

export interface IPerformanceMetrics {
  totalTasksCompleted: number;
  averageCompletionTime: number;
  ticketsResolved: number;
  maintenanceCompleted: number;
  safetyInspectionsCompleted: number;
  dailyLogEntries: number;
  lastActivityDate?: Date;
  efficiency: number;
  rating: number;
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
  
  // User access levels (for authentication)
  accessLevel?: 'super_admin' | 'department_admin' | 'normal_user';
  
  // Additional profile fields
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  country?: string;
  jobTitle?: string;
  bio?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ShiftInfoSchema = new Schema({
  shiftType: {
    type: String,
    enum: ['day', 'night', 'rotating', 'on-call'],
    required: true,
  },
  shiftStartTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM format.'
    }
  },
  shiftEndTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM format.'
    }
  },
  workDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.length <= 7;
      },
      message: 'Must specify at least one work day and maximum seven days.'
    }
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  effectiveDate: {
    type: Date,
    default: Date.now,
  },
});

const EmployeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address',
    ],
    index: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[\+]?[\d\s\-\(\)]{10,20}$/,
      'Please enter a valid phone number',
    ],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department name cannot exceed 50 characters'],
    index: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [50, 'Role cannot exceed 50 characters'],
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
    index: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  supervisor: {
    type: String,
    trim: true,
    index: true,
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
  
  // User access levels (for authentication)
  accessLevel: {
    type: String,
    enum: ['super_admin', 'department_admin', 'normal_user'],
    default: 'normal_user',
    index: true,
  },
  
  // Additional profile fields
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters'],
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters'],
  },
  country: {
    type: String,
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters'],
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters'],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
EmployeeSchema.index({ department: 1, status: 1 });
EmployeeSchema.index({ role: 1, status: 1 });
EmployeeSchema.index({ supervisor: 1 });
EmployeeSchema.index({ 'shiftInfo.shiftType': 1 });
EmployeeSchema.index({ accessLevel: 1, department: 1 });

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

const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;