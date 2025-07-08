import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

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