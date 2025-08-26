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
const MaintenanceChecklistRecordSchema = new mongoose_1.Schema({
    itemId: {
        type: String,
        required: [true, 'Item ID is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: {
            values: ['completed', 'failed', 'skipped'],
            message: 'Status must be completed, failed, or skipped',
        },
        required: [true, 'Status is required'],
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    images: [{
            type: String,
            trim: true,
        }],
}, { _id: true });
const MaintenancePartRecordSchema = new mongoose_1.Schema({
    partId: {
        type: String,
        required: [true, 'Part ID is required'],
        trim: true,
    },
    partName: {
        type: String,
        required: [true, 'Part name is required'],
        trim: true,
        maxlength: [100, 'Part name cannot exceed 100 characters'],
    },
    replaced: {
        type: Boolean,
        default: false,
    },
    replacementPartId: {
        type: String,
        trim: true,
    },
    replacementNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Replacement notes cannot exceed 500 characters'],
    },
    condition: {
        type: String,
        enum: {
            values: ['excellent', 'good', 'fair', 'poor'],
            message: 'Condition must be excellent, good, fair, or poor',
        },
        required: [true, 'Condition is required'],
    },
    timeSpent: {
        type: Number,
        required: [true, 'Time spent is required'],
        min: [0, 'Time spent cannot be negative'],
        max: [1440, 'Time spent cannot exceed 1440 minutes (24 hours)'],
    },
    checklistItems: [MaintenanceChecklistRecordSchema],
}, { _id: true });
const MaintenanceRecordSchema = new mongoose_1.Schema({
    scheduleId: {
        type: String,
        required: [true, 'Schedule ID is required'],
        trim: true,
        index: true,
    },
    assetId: {
        type: String,
        required: [true, 'Asset ID is required'],
        trim: true,
        index: true,
    },
    assetName: {
        type: String,
        required: [true, 'Asset name is required'],
        trim: true,
        maxlength: [100, 'Asset name cannot exceed 100 characters'],
        index: true,
    },
    completedDate: {
        type: Date,
        required: [true, 'Completed date is required'],
        index: true,
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        trim: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        trim: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    actualDuration: {
        type: Number,
        required: [true, 'Actual duration is required'],
        min: [0, 'Duration cannot be negative'],
        max: [168, 'Duration cannot exceed 168 hours (1 week)'],
    },
    technician: {
        type: String,
        required: [true, 'Technician name is required'],
        trim: true,
        maxlength: [100, 'Technician name cannot exceed 100 characters'],
        index: true,
    },
    technicianId: {
        type: String,
        required: [true, 'Technician ID is required'],
        trim: true,
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ['completed', 'partially_completed', 'failed', 'in_progress'],
            message: 'Status must be completed, partially_completed, failed, or in_progress',
        },
        required: [true, 'Status is required'],
        index: true,
    },
    overallCondition: {
        type: String,
        enum: {
            values: ['excellent', 'good', 'fair', 'poor'],
            message: 'Overall condition must be excellent, good, fair, or poor',
        },
        required: [true, 'Overall condition is required'],
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    partsStatus: [MaintenancePartRecordSchema],
    images: [{
            type: String,
            trim: true,
        }],
    adminVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    adminVerifiedBy: {
        type: String,
        trim: true,
        maxlength: [100, 'Admin name cannot exceed 100 characters'],
    },
    adminVerifiedAt: {
        type: Date,
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
    nextScheduledDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
MaintenanceRecordSchema.index({ scheduleId: 1, completedDate: -1 });
MaintenanceRecordSchema.index({ assetId: 1, status: 1 });
MaintenanceRecordSchema.index({ technician: 1, completedDate: -1 });
MaintenanceRecordSchema.index({ adminVerified: 1, completedDate: -1 });
MaintenanceRecordSchema.index({ status: 1, completedDate: -1 });
MaintenanceRecordSchema.index({ assetName: 'text', technician: 'text', notes: 'text' });
MaintenanceRecordSchema.virtual('completionPercentage').get(function () {
    if (!this.partsStatus || this.partsStatus.length === 0)
        return 0;
    const totalItems = this.partsStatus.reduce((sum, part) => sum + part.checklistItems.length, 0);
    const completedItems = this.partsStatus.reduce((sum, part) => sum + part.checklistItems.filter(item => item.completed).length, 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
});
MaintenanceRecordSchema.pre('save', function (next) {
    if (this.isModified('adminVerified') && this.adminVerified && !this.adminVerifiedAt) {
        this.adminVerifiedAt = new Date();
    }
    next();
});
MaintenanceRecordSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (ret.partsStatus) {
            ret.partsStatus = ret.partsStatus.map((part) => {
                part.id = part._id;
                delete part._id;
                if (part.checklistItems) {
                    part.checklistItems = part.checklistItems.map((item) => {
                        item.id = item._id;
                        delete item._id;
                        return item;
                    });
                }
                return part;
            });
        }
        return ret;
    },
});
const MaintenanceRecord = mongoose_1.default.model('MaintenanceRecord', MaintenanceRecordSchema);
exports.default = MaintenanceRecord;
