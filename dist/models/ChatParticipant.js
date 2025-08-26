"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatParticipantSchema = new mongoose_1.Schema({
    chatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
ChatParticipantSchema.index({ chatId: 1, userId: 1 }, { unique: true });
ChatParticipantSchema.index({ userId: 1, isActive: 1 });
ChatParticipantSchema.index({ chatId: 1, isActive: 1 });
ChatParticipantSchema.index({ department: 1, isActive: 1 });
ChatParticipantSchema.virtual('isOnline').get(function () {
    if (!this.lastSeenAt)
        return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.lastSeenAt > fiveMinutesAgo;
});
ChatParticipantSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
ChatParticipantSchema.pre('save', function () {
    if (!this.isActive && !this.leftAt) {
        this.leftAt = new Date();
    }
});
exports.default = (0, mongoose_1.model)('ChatParticipant', ChatParticipantSchema);
