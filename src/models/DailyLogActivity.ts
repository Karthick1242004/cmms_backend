import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyLogActivity extends Document {
  _id: string;
  date: Date;
  time: string;
  area: string;
  departmentId: string;
  departmentName: string;
  assetId: string;
  assetName: string;
  natureOfProblem: string;
  commentsOrSolution: string;
  attendedBy: string; // Employee ID
  attendedByName: string; // Employee name for quick access
  verifiedBy?: string; // Employee ID (optional)
  verifiedByName?: string; // Employee name for quick access
  status: 'open' | 'in-progress' | 'resolved' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogActivitySchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  time: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  departmentId: {
    type: String,
    required: true,
    index: true
  },
  departmentName: {
    type: String,
    required: true,
    trim: true
  },
  assetId: {
    type: String,
    required: true,
    index: true
  },
  assetName: {
    type: String,
    required: true,
    trim: true
  },
  natureOfProblem: {
    type: String,
    required: true,
    trim: true
  },
  commentsOrSolution: {
    type: String,
    required: true,
    trim: true
  },
  attendedBy: {
    type: String,
    required: true,
    index: true
  },
  attendedByName: {
    type: String,
    required: true,
    trim: true
  },
  verifiedBy: {
    type: String,
    index: true
  },
  verifiedByName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'verified'],
    default: 'open',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdByName: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'dailylogactivities'
});

// Indexes for better query performance
DailyLogActivitySchema.index({ date: -1 });
DailyLogActivitySchema.index({ departmentId: 1, date: -1 });
DailyLogActivitySchema.index({ assetId: 1, date: -1 });
DailyLogActivitySchema.index({ attendedBy: 1, date: -1 });
DailyLogActivitySchema.index({ status: 1, priority: 1 });

const DailyLogActivity = mongoose.model<IDailyLogActivity>('DailyLogActivity', DailyLogActivitySchema);

export default DailyLogActivity;