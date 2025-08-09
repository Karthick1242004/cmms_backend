"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
    lastMessage: {
        messageId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Message'
        },
        content: {
            type: String,
            trim: true
        },
        senderId: {
            type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {
    timestamps: true,
    collection: 'chats'
});
ChatSchema.index({ department: 1, type: 1 });
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastActivity: -1 });
ChatSchema.index({ department: 1, isActive: 1 });
ChatSchema.virtual('participantCount').get(function () {
    return this.participants?.length || 0;
});
ChatSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
exports.default = (0, mongoose_1.model)('Chat', ChatSchema);
