import { Schema, model, Document, Types } from 'mongoose';

export interface IChat extends Document {
  _id: Types.ObjectId;
  department: string;
  departmentId?: string;
  name: string;
  description?: string;
  type: 'department' | 'group' | 'direct';
  participants: Types.ObjectId[];
  lastMessage?: {
    messageId: Types.ObjectId;
    content: string;
    senderId: Types.ObjectId;
    senderName: string;
    sentAt: Date;
    messageType: 'text' | 'file' | 'image';
  };
  lastActivity: Date;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>({
  department: {
    type: String,
    required: true,
    index: true
  },
  departmentId: {
    type: String,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['department', 'group', 'direct'],
    default: 'department',
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  lastMessage: {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    content: {
      type: String,
      trim: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    },
    senderName: String,
    sentAt: Date,
    messageType: {
      type: String,
      enum: ['text', 'file', 'image'],
      default: 'text'
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true,
  collection: 'chats'
});

// Indexes for better performance
ChatSchema.index({ department: 1, type: 1 });
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastActivity: -1 });
ChatSchema.index({ department: 1, isActive: 1 });

// Virtual for participant count
ChatSchema.virtual('participantCount').get(function(this: IChat) {
  return this.participants?.length || 0;
});

// Transform output to include id field and remove __v
ChatSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default model<IChat>('Chat', ChatSchema);
