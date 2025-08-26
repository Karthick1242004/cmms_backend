"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NoticeBoardSchema = new mongoose_1.Schema({
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
            validator: function (v) {
                if (this.type === 'link' || this.type === 'file') {
                    if (!v)
                        return false;
                    try {
                        new URL(v);
                        return true;
                    }
                    catch {
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
NoticeBoardSchema.index({ isActive: 1, isPublished: 1, publishedAt: -1 });
NoticeBoardSchema.index({ targetAudience: 1, targetDepartments: 1 });
NoticeBoardSchema.index({ expiresAt: 1 });
NoticeBoardSchema.index({ priority: 1, publishedAt: -1 });
NoticeBoardSchema.index({ tags: 1 });
NoticeBoardSchema.index({ createdBy: 1 });
NoticeBoardSchema.virtual('isExpired').get(function () {
    return this.expiresAt && this.expiresAt < new Date();
});
NoticeBoardSchema.virtual('isVisible').get(function () {
    return this.isActive &&
        this.isPublished &&
        (!this.expiresAt || this.expiresAt > new Date());
});
NoticeBoardSchema.methods.canUserView = function (userDepartment, userRole) {
    if (!this.isVisible)
        return false;
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
NoticeBoardSchema.methods.markAsViewed = function (userId, userName) {
    const existingView = this.viewedBy.find((view) => view.userId === userId);
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
exports.default = mongoose_1.default.model('NoticeBoard', NoticeBoardSchema);
