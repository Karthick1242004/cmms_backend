import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  _id: string;
  assetId: string;
  assetName: string;
  department: string;
  type: 'preventive' | 'corrective' | 'emergency' | 'scheduled';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  assignedTo?: string; // Employee ID
  createdBy: string; // Employee ID
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  cost?: number;
  parts?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    cost: number;
  }>;
  notes?: string;
  attachments?: string[]; // Array of file URLs
  createdAt: Date;
  updatedAt: Date;
}

const PartUsageSchema = new Schema({
  partId: {
    type: String,
    required: true,
    trim: true,
  },
  partName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'Cost cannot be negative'],
  },
});

const MaintenanceSchema = new Schema<IMaintenance>({
  assetId: {
    type: String,
    required: [true, 'Asset ID is required'],
    trim: true,
    index: true,
  },
  assetName: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [100, 'Asset name cannot exceed 100 characters'],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters'],
    index: true,
  },
  type: {
    type: String,
    enum: {
      values: ['preventive', 'corrective', 'emergency', 'scheduled'],
      message: 'Type must be preventive, corrective, emergency, or scheduled',
    },
    required: [true, 'Maintenance type is required'],
    index: true,
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'in-progress', 'completed', 'cancelled', 'overdue'],
      message: 'Status must be scheduled, in-progress, completed, cancelled, or overdue',
    },
    default: 'scheduled',
    index: true,
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Priority must be low, medium, high, or critical',
    },
    default: 'medium',
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Maintenance title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  assignedTo: {
    type: String,
    trim: true,
    index: true,
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    trim: true,
    index: true,
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    index: true,
  },
  startDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative'],
  },
  parts: [PartUsageSchema],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  attachments: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
MaintenanceSchema.index({ status: 1, priority: 1 });
MaintenanceSchema.index({ department: 1, status: 1 });
MaintenanceSchema.index({ assignedTo: 1, status: 1 });
MaintenanceSchema.index({ assetId: 1 });
MaintenanceSchema.index({ scheduledDate: 1, status: 1 });
MaintenanceSchema.index({ type: 1, status: 1 });

// Transform to frontend format
MaintenanceSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Maintenance = mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);

export default Maintenance;
