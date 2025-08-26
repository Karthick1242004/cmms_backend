import mongoose, { Document, Schema } from 'mongoose';

export interface IMeetingMinutes extends Document {
  _id: string;
  title: string;
  department: string;
  meetingDateTime: Date;
  purpose: string;
  minutes: string;
  createdBy: string;
  createdByName: string;
  attendees: string[];
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  location: string;
  duration: number; // in minutes
  actionItems: {
    _id?: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  attachments: {
    filename: string;
    url: string;
    uploadedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MeetingMinutesSchema = new Schema<IMeetingMinutes>(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true,
    },
    meetingDateTime: {
      type: Date,
      required: [true, 'Meeting date and time is required'],
      index: true,
    },
    purpose: {
      type: String,
      required: [true, 'Meeting purpose is required'],
      trim: true,
      maxlength: [1000, 'Purpose cannot exceed 1000 characters'],
    },
    minutes: {
      type: String,
      required: [true, 'Meeting minutes content is required'],
      trim: true,
      maxlength: [10000, 'Minutes cannot exceed 10000 characters'],
    },
    createdBy: {
      type: String,
      required: [true, 'Created by user ID is required'],
      index: true,
    },
    createdByName: {
      type: String,
      required: [true, 'Created by user name is required'],
      trim: true,
    },
    attendees: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: 'Status must be draft, published, or archived',
      },
      default: 'published',
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
      max: [480, 'Duration cannot exceed 8 hours (480 minutes)'],
    },
    actionItems: [{
      description: {
        type: String,
        required: [true, 'Action item description is required'],
        trim: true,
        maxlength: [500, 'Action item description cannot exceed 500 characters'],
      },
      assignedTo: {
        type: String,
        required: [true, 'Action item must be assigned to someone'],
        trim: true,
      },
      dueDate: {
        type: Date,
        required: [true, 'Due date is required for action items'],
      },
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
      },
    }],
    attachments: [{
      filename: {
        type: String,
        required: [true, 'Filename is required'],
        trim: true,
      },
      url: {
        type: String,
        required: [true, 'File URL is required'],
        trim: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
MeetingMinutesSchema.index({ department: 1, meetingDateTime: -1 });
MeetingMinutesSchema.index({ createdBy: 1, meetingDateTime: -1 });
MeetingMinutesSchema.index({ department: 1, status: 1 });
MeetingMinutesSchema.index({ title: 'text', purpose: 'text', minutes: 'text' });

// Virtual for formatted meeting info
MeetingMinutesSchema.virtual('displayInfo').get(function() {
  return `${this.title} - ${this.department} (${this.meetingDateTime.toLocaleDateString()})`;
});

// Pre-save middleware to ensure proper capitalization
MeetingMinutesSchema.pre('save', function(next) {
  if (this.title) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  if (this.department) {
    this.department = this.department.charAt(0).toUpperCase() + this.department.slice(1);
  }
  next();
});

// Transform to frontend format
MeetingMinutesSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const MeetingMinutes = mongoose.model<IMeetingMinutes>('MeetingMinutes', MeetingMinutesSchema);

export default MeetingMinutes;