import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  _id: string;
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      maxlength: [100, 'Department name cannot exceed 100 characters'],
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Department description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    manager: {
      type: String,
      required: [true, 'Manager name is required'],
      trim: true,
      maxlength: [100, 'Manager name cannot exceed 100 characters'],
    },
    employeeCount: {
      type: Number,
      default: 0,
      min: [0, 'Employee count cannot be negative'],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
DepartmentSchema.index({ name: 1, status: 1 });
DepartmentSchema.index({ manager: 1 });

// Virtual for formatted department info
DepartmentSchema.virtual('displayInfo').get(function() {
  return `${this.name} - ${this.manager} (${this.employeeCount} employees)`;
});

// Pre-save middleware to capitalize first letter of name and manager
DepartmentSchema.pre('save', function(next) {
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  if (this.manager) {
    this.manager = this.manager.charAt(0).toUpperCase() + this.manager.slice(1);
  }
  next();
});

// Transform to frontend format
DepartmentSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);

export default Department; 