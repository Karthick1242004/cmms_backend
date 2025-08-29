import mongoose, { Document, Schema } from 'mongoose';
import Counter from './Counter';

export interface ITicket extends Document {
  _id: string;
  ticketId: string; // Auto-generated unique ticket ID like TKT-2025-000001
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  department: string;
  assignedTo?: string; // Employee ID
  createdBy: string; // Employee ID
  assetId?: string; // Asset ID if related to an asset
  location?: string;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  attachments?: string[]; // Array of file URLs
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Ticket description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in-progress', 'pending', 'completed', 'cancelled'],
      message: 'Status must be open, in-progress, pending, completed, or cancelled',
    },
    default: 'open',
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    index: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters'],
    index: true,
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
  assetId: {
    type: String,
    trim: true,
    index: true,
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters'],
  },
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
  },
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  attachments: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
TicketSchema.index({ status: 1, priority: 1 });
TicketSchema.index({ department: 1, status: 1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ createdBy: 1 });
TicketSchema.index({ assetId: 1 });
TicketSchema.index({ dueDate: 1, status: 1 });

// Transform to frontend format
TicketSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Generate ticketId before validation so 'required' validation passes
// FIXED: Use atomic counter to prevent race conditions and duplicate IDs
TicketSchema.pre('validate', async function (next) {
  try {
    if (this.isNew && !this.ticketId) {
      const year = new Date().getFullYear()
      
      // Use separate Counter model to atomically get the next sequence number
      // This prevents race conditions when multiple tickets are created simultaneously
      const result = await (Counter as any).findOneAndUpdate(
        { _id: `ticket_${year}` }, // Use year-specific counter
        { $inc: { sequence: 1 } }, // Increment the sequence
        { 
          upsert: true, // Create if doesn't exist
          new: true, // Return the updated document
          setDefaultsOnInsert: true // Set defaults on insert
        }
      )
      
      // Generate ticketId with the sequence number
      this.ticketId = `TKT-${year}-${String(result.sequence).padStart(6, '0')}`
    }
    next()
  } catch (err) {
    next(err as any)
  }
})

const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
