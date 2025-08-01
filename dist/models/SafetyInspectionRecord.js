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
const SafetyChecklistRecordSchema = new mongoose_1.Schema({
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
    safetyStandard: {
        type: String,
        trim: true,
        maxlength: [100, 'Safety standard cannot exceed 100 characters'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: {
            values: ['compliant', 'non_compliant', 'not_applicable', 'requires_attention'],
            message: 'Status must be compliant, non_compliant, not_applicable, or requires_attention',
        },
        required: [true, 'Status is required'],
    },
    riskLevel: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Risk level must be low, medium, high, or critical',
        },
        required: [true, 'Risk level is required'],
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    correctiveAction: {
        type: String,
        trim: true,
        maxlength: [500, 'Corrective action cannot exceed 500 characters'],
    },
    images: [{
            type: String,
            trim: true,
        }],
}, { _id: false });
const SafetyChecklistCategoryRecordSchema = new mongoose_1.Schema({
    categoryId: {
        type: String,
        required: [true, 'Category ID is required'],
        trim: true,
    },
    categoryName: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    checklistItems: [SafetyChecklistRecordSchema],
    categoryComplianceScore: {
        type: Number,
        required: [true, 'Category compliance score is required'],
        min: [0, 'Compliance score must be at least 0'],
        max: [100, 'Compliance score cannot exceed 100'],
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [1, 'Weight must be at least 1%'],
        max: [100, 'Weight cannot exceed 100%'],
    },
    timeSpent: {
        type: Number,
        required: [true, 'Time spent is required'],
        min: [0, 'Time spent must be at least 0 minutes'],
    },
}, { _id: false });
const SafetyViolationSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: [true, 'Violation description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    riskLevel: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Risk level must be low, medium, high, or critical',
        },
        required: [true, 'Risk level is required'],
    },
    safetyStandard: {
        type: String,
        trim: true,
        maxlength: [100, 'Safety standard cannot exceed 100 characters'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    correctiveAction: {
        type: String,
        required: [true, 'Corrective action is required'],
        trim: true,
        maxlength: [500, 'Corrective action cannot exceed 500 characters'],
    },
    priority: {
        type: String,
        enum: {
            values: ['immediate', 'urgent', 'moderate', 'low'],
            message: 'Priority must be immediate, urgent, moderate, or low',
        },
        required: [true, 'Priority is required'],
    },
    assignedTo: {
        type: String,
        trim: true,
        maxlength: [100, 'Assigned to cannot exceed 100 characters'],
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['open', 'in_progress', 'resolved', 'closed'],
            message: 'Status must be open, in_progress, resolved, or closed',
        },
        default: 'open',
    },
    images: [{
            type: String,
            trim: true,
        }],
}, { _id: true });
const SafetyInspectionRecordSchema = new mongoose_1.Schema({
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
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        trim: true,
    },
    actualDuration: {
        type: Number,
        required: [true, 'Actual duration is required'],
        min: [0, 'Duration must be at least 0 hours'],
        max: [168, 'Duration cannot exceed 168 hours (1 week)'],
    },
    inspector: {
        type: String,
        required: [true, 'Inspector is required'],
        trim: true,
        maxlength: [100, 'Inspector name cannot exceed 100 characters'],
        index: true,
    },
    inspectorId: {
        type: String,
        required: [true, 'Inspector ID is required'],
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
    overallComplianceScore: {
        type: Number,
        required: [true, 'Overall compliance score is required'],
        min: [0, 'Compliance score must be at least 0'],
        max: [100, 'Compliance score cannot exceed 100'],
        index: true,
    },
    complianceStatus: {
        type: String,
        enum: {
            values: ['compliant', 'non_compliant', 'requires_attention'],
            message: 'Compliance status must be compliant, non_compliant, or requires_attention',
        },
        required: [true, 'Compliance status is required'],
        index: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    categoryResults: [SafetyChecklistCategoryRecordSchema],
    violations: [SafetyViolationSchema],
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
        maxlength: [100, 'Admin verified by cannot exceed 100 characters'],
    },
    adminVerifiedAt: {
        type: Date,
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
    correctiveActionsRequired: {
        type: Boolean,
        default: false,
        index: true,
    },
    nextScheduledDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
SafetyInspectionRecordSchema.index({ scheduleId: 1, completedDate: -1 });
SafetyInspectionRecordSchema.index({ inspector: 1, status: 1 });
SafetyInspectionRecordSchema.index({ complianceStatus: 1, adminVerified: 1 });
SafetyInspectionRecordSchema.index({ completedDate: -1, overallComplianceScore: -1 });
SafetyInspectionRecordSchema.index({ 'violations.status': 1, 'violations.riskLevel': 1 });
SafetyInspectionRecordSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (ret.violations) {
            ret.violations = ret.violations.map((violation) => {
                violation.id = violation._id;
                delete violation._id;
                return violation;
            });
        }
        return ret;
    },
});
const SafetyInspectionRecord = mongoose_1.default.model('SafetyInspectionRecord', SafetyInspectionRecordSchema);
exports.default = SafetyInspectionRecord;
