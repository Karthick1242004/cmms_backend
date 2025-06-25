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
const MaintenanceChecklistItemSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: [true, 'Checklist item description is required'],
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    isRequired: {
        type: Boolean,
        default: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed', 'skipped'],
            message: 'Status must be pending, completed, failed, or skipped',
        },
        default: 'pending',
    },
}, { _id: true });
const MaintenancePartSchema = new mongoose_1.Schema({
    partId: {
        type: String,
        required: [true, 'Part ID is required'],
        trim: true,
        index: true,
    },
    partName: {
        type: String,
        required: [true, 'Part name is required'],
        trim: true,
        maxlength: [100, 'Part name cannot exceed 100 characters'],
    },
    partSku: {
        type: String,
        required: [true, 'Part SKU is required'],
        trim: true,
        maxlength: [50, 'Part SKU cannot exceed 50 characters'],
    },
    estimatedTime: {
        type: Number,
        required: [true, 'Estimated time is required'],
        min: [1, 'Estimated time must be at least 1 minute'],
        max: [1440, 'Estimated time cannot exceed 1440 minutes (24 hours)'],
    },
    requiresReplacement: {
        type: Boolean,
        default: false,
    },
    replacementFrequency: {
        type: Number,
        min: [1, 'Replacement frequency must be at least 1'],
    },
    lastReplacementDate: {
        type: Date,
    },
    checklistItems: [MaintenanceChecklistItemSchema],
}, { _id: true });
const MaintenanceScheduleSchema = new mongoose_1.Schema({
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
    assetTag: {
        type: String,
        trim: true,
        maxlength: [50, 'Asset tag cannot exceed 50 characters'],
        index: true,
    },
    assetType: {
        type: String,
        required: [true, 'Asset type is required'],
        trim: true,
        maxlength: [50, 'Asset type cannot exceed 50 characters'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Maintenance title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    frequency: {
        type: String,
        enum: {
            values: ['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'],
            message: 'Frequency must be daily, weekly, monthly, quarterly, annually, or custom',
        },
        required: [true, 'Frequency is required'],
        index: true,
    },
    customFrequencyDays: {
        type: Number,
        min: [1, 'Custom frequency must be at least 1 day'],
        max: [3650, 'Custom frequency cannot exceed 3650 days (10 years)'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        index: true,
    },
    nextDueDate: {
        type: Date,
        required: [true, 'Next due date is required'],
        index: true,
    },
    lastCompletedDate: {
        type: Date,
        index: true,
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Priority must be low, medium, high, or critical',
        },
        required: [true, 'Priority is required'],
        index: true,
    },
    estimatedDuration: {
        type: Number,
        required: [true, 'Estimated duration is required'],
        min: [0.1, 'Estimated duration must be at least 0.1 hours'],
        max: [168, 'Estimated duration cannot exceed 168 hours (1 week)'],
    },
    assignedTechnician: {
        type: String,
        trim: true,
        maxlength: [100, 'Assigned technician name cannot exceed 100 characters'],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'completed', 'overdue'],
            message: 'Status must be active, inactive, completed, or overdue',
        },
        default: 'active',
        index: true,
    },
    createdBy: {
        type: String,
        required: [true, 'Created by is required'],
        trim: true,
        maxlength: [100, 'Created by cannot exceed 100 characters'],
    },
    parts: [MaintenancePartSchema],
}, {
    timestamps: true,
    versionKey: false,
});
// Indexes for better query performance
MaintenanceScheduleSchema.index({ assetId: 1, status: 1 });
MaintenanceScheduleSchema.index({ nextDueDate: 1, status: 1 });
MaintenanceScheduleSchema.index({ assignedTechnician: 1, status: 1 });
MaintenanceScheduleSchema.index({ frequency: 1, priority: 1 });
MaintenanceScheduleSchema.index({ title: 'text', assetName: 'text', location: 'text' });
// Virtual for checking if overdue
MaintenanceScheduleSchema.virtual('isOverdue').get(function () {
    return this.status === 'active' && this.nextDueDate < new Date();
});
// Pre-save middleware to update status based on due date
MaintenanceScheduleSchema.pre('save', function (next) {
    const now = new Date();
    if (this.status === 'active' && this.nextDueDate < now) {
        this.status = 'overdue';
    }
    next();
});
// Transform to frontend format
MaintenanceScheduleSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Transform nested parts and checklist items
        if (ret.parts) {
            ret.parts = ret.parts.map((part) => {
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
const MaintenanceSchedule = mongoose_1.default.model('MaintenanceSchedule', MaintenanceScheduleSchema);
exports.default = MaintenanceSchedule;
//# sourceMappingURL=MaintenanceSchedule.js.map