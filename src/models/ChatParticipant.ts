import { Schema, model, Document, Types } from 'mongoose';

export interface IChatParticipant extends Document {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  department: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  lastSeenAt?: Date;
  lastMessageReadAt?: Date;
  notificationSettings: {
    muted: boolean;
    mutedUntil?: Date;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  isActive: boolean;
  leftAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatParticipantSchema = new Schema<IChatParticipant>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  lastSeenAt: {
    type: Date,
    index: true
  },
  lastMessageReadAt: {
    type: Date
  },
  notificationSettings: {
    muted: {
      type: Boolean,
      default: false
    },
    mutedUntil: {
      type: Date
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  leftAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'chat_participants'
});

// Compound indexes for better performance
ChatParticipantSchema.index({ chatId: 1, userId: 1 }, { unique: true });
ChatParticipantSchema.index({ userId: 1, isActive: 1 });
ChatParticipantSchema.index({ chatId: 1, isActive: 1 });
ChatParticipantSchema.index({ department: 1, isActive: 1 });

// Virtual for online status (this would be determined by last activity)
ChatParticipantSchema.virtual('isOnline').get(function(this: IChatParticipant) {
  if (!this.lastSeenAt) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastSeenAt > fiveMinutesAgo;
});

// Transform output to include id field and remove __v
ChatParticipantSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Pre-save middleware to handle participant leaving
ChatParticipantSchema.pre('save', function(this: IChatParticipant) {
  if (!this.isActive && !this.leftAt) {
    this.leftAt = new Date();
  }
});

export default model<IChatParticipant>('ChatParticipant', ChatParticipantSchema);
