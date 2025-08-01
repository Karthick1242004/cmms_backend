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
const SafetyChecklistItemSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: [true, 'Checklist item description is required'],
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    safetyStandard: {
        type: String,
        trim: true,
        maxlength: [100, 'Safety standard cannot exceed 100 characters'],
    },
    isRequired: {
        type: Boolean,
        default: true,
    },
    riskLevel: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Risk level must be low, medium, high, or critical',
        },
        default: 'medium',
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'compliant', 'non_compliant', 'not_applicable', 'requires_attention'],
            message: 'Status must be pending, compliant, non_compliant, not_applicable, or requires_attention',
        },
        default: 'pending',
    },
}, { _id: true });
const SafetyChecklistCategorySchema = new mongoose_1.Schema({
    categoryName: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    required: {
        type: Boolean,
        default: true,
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [1, 'Weight must be at least 1%'],
        max: [100, 'Weight cannot exceed 100%'],
    },
    checklistItems: [SafetyChecklistItemSchema],
}, { _id: true });
const SafetyInspectionScheduleSchema = new mongoose_1.Schema({
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
        required: [true, 'Inspection title is required'],
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
    riskLevel: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Risk level must be low, medium, high, or critical',
        },
        required: [true, 'Risk level is required'],
        index: true,
    },
    estimatedDuration: {
        type: Number,
        required: [true, 'Estimated duration is required'],
        min: [0.1, 'Estimated duration must be at least 0.1 hours'],
        max: [168, 'Estimated duration cannot exceed 168 hours (1 week)'],
    },
    assignedInspector: {
        type: String,
        trim: true,
        maxlength: [100, 'Assigned inspector name cannot exceed 100 characters'],
        index: true,
    },
    safetyStandards: [{
            type: String,
            trim: true,
            maxlength: [50, 'Safety standard cannot exceed 50 characters'],
        }],
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
    checklistCategories: [SafetyChecklistCategorySchema],
}, {
    timestamps: true,
    versionKey: false,
});
SafetyInspectionScheduleSchema.index({ assetId: 1, status: 1 });
SafetyInspectionScheduleSchema.index({ nextDueDate: 1, status: 1 });
SafetyInspectionScheduleSchema.index({ assignedInspector: 1, status: 1 });
SafetyInspectionScheduleSchema.index({ frequency: 1, priority: 1, riskLevel: 1 });
SafetyInspectionScheduleSchema.index({ title: 'text', assetName: 'text', location: 'text' });
SafetyInspectionScheduleSchema.index({ safetyStandards: 1 });
SafetyInspectionScheduleSchema.virtual('isOverdue').get(function () {
    return this.status === 'active' && this.nextDueDate < new Date();
});
SafetyInspectionScheduleSchema.pre('save', function (next) {
    const now = new Date();
    if (this.status === 'active' && this.nextDueDate < now) {
        this.status = 'overdue';
    }
    next();
});
SafetyInspectionScheduleSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (ret.checklistCategories) {
            ret.checklistCategories = ret.checklistCategories.map((category) => {
                category.id = category._id;
                delete category._id;
                if (category.checklistItems) {
                    category.checklistItems = category.checklistItems.map((item) => {
                        item.id = item._id;
                        delete item._id;
                        return item;
                    });
                }
                return category;
            });
        }
        return ret;
    },
});
const SafetyInspectionSchedule = mongoose_1.default.model('SafetyInspectionSchedule', SafetyInspectionScheduleSchema);
exports.default = SafetyInspectionSchedule;
