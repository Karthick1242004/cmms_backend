import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  senderDepartment: string;
  content: string;
  messageType: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  replyTo?: Types.ObjectId;
  editedAt?: Date;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  readBy: {
    userId: Types.ObjectId;
    userName: string;
    readAt: Date;
  }[];
  reactions: {
    emoji: string;
    userId: Types.ObjectId;
    userName: string;
    reactedAt: Date;
  }[];
  mentions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  senderAvatar: {
    type: String,
    trim: true
  },
  senderDepartment: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text',
    required: true
  },
  fileUrl: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number,
    min: 0
  },
  mimeType: {
    type: String,
    trim: true
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  editedAt: {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date
  },
  readBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    emoji: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }]
}, {
  timestamps: true,
  collection: 'messages'
});

// Indexes for better performance
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ chatId: 1, isDeleted: 1, createdAt: -1 });
MessageSchema.index({ mentions: 1 });
MessageSchema.index({ 'readBy.userId': 1 });

// Virtual for unread status
MessageSchema.virtual('isUnread').get(function(this: IMessage) {
  // This would be determined by checking if current user is in readBy array
  return false; // Default value, actual logic handled in frontend
});

// Transform output to include id field and remove __v
MessageSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Pre-save middleware to handle soft deletes
MessageSchema.pre('save', function(this: IMessage) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }
  if (this.isModified('content') && !this.isNew) {
    this.editedAt = new Date();
    this.isEdited = true;
  }
});

export default model<IMessage>('Message', MessageSchema);
