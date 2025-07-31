import mongoose, { Document, Schema } from 'mongoose';

export interface INoticeBoard extends Document {
  _id: string;
  title: string;
  content: string;
  type: 'text' | 'link' | 'file';
  linkUrl?: string; // For links to images or files
  fileName?: string; // Original file name if type is 'file'
  fileType?: string; // MIME type for files
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'department' | 'role';
  targetDepartments?: string[]; // Department IDs if targetAudience is 'department'
  targetRoles?: string[]; // Roles if targetAudience is 'role'
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  viewCount: number;
  viewedBy: Array<{
    userId: string;
    userName: string;
    viewedAt: Date;
  }>;
  tags: string[];
  createdBy: string; // Employee ID
  createdByName: string; // Employee name for quick access
  createdByRole: string; // Role for permissions
  updatedBy?: string;
  updatedByName?: string;
  createdAt: Date;
  updatedAt: Date;
  isVisible?: boolean; // Virtual property
  isExpired?: boolean; // Virtual property
  canUserView(userDepartment: string, userRole: string): boolean;
  markAsViewed(userId: string, userName: string): Promise<INoticeBoard>;
}

const NoticeBoardSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 5000
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'link', 'file'],
    default: 'text'
  },
  linkUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: INoticeBoard, v: string) {
        // Only validate URL if type is 'link' or 'file'
        if (this.type === 'link' || this.type === 'file') {
          if (!v) return false;
          // Basic URL validation
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        }
        return true;
      },
      message: 'Please provide a valid URL for link or file type notices'
    }
  },
  fileName: {
    type: String,
    trim: true
  },
  fileType: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    required: true,
    enum: ['all', 'department', 'role'],
    default: 'all'
  },
  targetDepartments: {
    type: [String],
    default: []
  },
  targetRoles: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: undefined
  },
  viewCount: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: String,
    required: true
  },
  createdByName: {
    type: String,
    required: true
  },
  createdByRole: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  updatedByName: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'noticeboards'
});

// Indexes for better performance
NoticeBoardSchema.index({ isActive: 1, isPublished: 1, publishedAt: -1 });
NoticeBoardSchema.index({ targetAudience: 1, targetDepartments: 1 });
NoticeBoardSchema.index({ expiresAt: 1 });
NoticeBoardSchema.index({ priority: 1, publishedAt: -1 });
NoticeBoardSchema.index({ tags: 1 });
NoticeBoardSchema.index({ createdBy: 1 });

// Virtual to check if notice is expired
NoticeBoardSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Virtual to check if notice is visible (active, published, and not expired)
NoticeBoardSchema.virtual('isVisible').get(function() {
  return this.isActive && 
         this.isPublished && 
         (!this.expiresAt || this.expiresAt > new Date());
});

// Method to check if user can view this notice
NoticeBoardSchema.methods.canUserView = function(this: INoticeBoard, userDepartment: string, userRole: string): boolean {
  if (!this.isVisible) return false;
  
  switch (this.targetAudience) {
    case 'all':
      return true;
    case 'department':
      return this.targetDepartments?.includes(userDepartment) || false;
    case 'role':
      return this.targetRoles?.includes(userRole) || false;
    default:
      return false;
  }
};

// Method to mark as viewed by user
NoticeBoardSchema.methods.markAsViewed = function(this: INoticeBoard, userId: string, userName: string): Promise<INoticeBoard> {
  // Check if user already viewed
  const existingView = this.viewedBy.find((view: any) => view.userId === userId);
  
  if (!existingView) {
    this.viewedBy.push({
      userId,
      userName,
      viewedAt: new Date()
    });
    this.viewCount = this.viewedBy.length;
  }
  
  return this.save();
};

export default mongoose.model<INoticeBoard>('NoticeBoard', NoticeBoardSchema);