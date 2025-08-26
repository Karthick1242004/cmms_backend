import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  _id: string;
  name: string;
  code: string;
  description?: string;
  manager?: string; // Employee ID of department manager
  employeeCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [50, 'Department name cannot exceed 50 characters'],
    unique: true,
    index: true,
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    trim: true,
    maxlength: [10, 'Department code cannot exceed 10 characters'],
    unique: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
  manager: {
    type: String,
    trim: true,
    index: true,
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
      message: 'Status must be active or inactive',
    },
    default: 'active',
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
DepartmentSchema.index({ name: 1, status: 1 });
DepartmentSchema.index({ code: 1, status: 1 });

// Transform to frontend format
DepartmentSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Department = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);

export default Department;
