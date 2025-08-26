"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    chatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Employee'
        }]
}, {
    timestamps: true,
    collection: 'messages'
});
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ chatId: 1, isDeleted: 1, createdAt: -1 });
MessageSchema.index({ mentions: 1 });
MessageSchema.index({ 'readBy.userId': 1 });
MessageSchema.virtual('isUnread').get(function () {
    return false;
});
MessageSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
MessageSchema.pre('save', function () {
    if (this.isDeleted && !this.deletedAt) {
        this.deletedAt = new Date();
    }
    if (this.isModified('content') && !this.isNew) {
        this.editedAt = new Date();
        this.isEdited = true;
    }
});
exports.default = (0, mongoose_1.model)('Message', MessageSchema);
