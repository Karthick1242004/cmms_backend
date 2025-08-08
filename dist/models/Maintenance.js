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
const PartUsageSchema = new mongoose_1.Schema({
    partId: {
        type: String,
        required: true,
        trim: true,
    },
    partName: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    cost: {
        type: Number,
        required: true,
        min: [0, 'Cost cannot be negative'],
    },
});
const MaintenanceSchema = new mongoose_1.Schema({
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
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [50, 'Department cannot exceed 50 characters'],
        index: true,
    },
    type: {
        type: String,
        enum: {
            values: ['preventive', 'corrective', 'emergency', 'scheduled'],
            message: 'Type must be preventive, corrective, emergency, or scheduled',
        },
        required: [true, 'Maintenance type is required'],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ['scheduled', 'in-progress', 'completed', 'cancelled', 'overdue'],
            message: 'Status must be scheduled, in-progress, completed, cancelled, or overdue',
        },
        default: 'scheduled',
        index: true,
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Priority must be low, medium, high, or critical',
        },
        default: 'medium',
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Maintenance title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    assignedTo: {
        type: String,
        trim: true,
        index: true,
    },
    createdBy: {
        type: String,
        required: [true, 'Created by is required'],
        trim: true,
        index: true,
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required'],
        index: true,
    },
    startDate: {
        type: Date,
    },
    completedDate: {
        type: Date,
    },
    estimatedHours: {
        type: Number,
        min: [0, 'Estimated hours cannot be negative'],
    },
    actualHours: {
        type: Number,
        min: [0, 'Actual hours cannot be negative'],
    },
    cost: {
        type: Number,
        min: [0, 'Cost cannot be negative'],
    },
    parts: [PartUsageSchema],
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    attachments: [{
            type: String,
            trim: true,
        }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
MaintenanceSchema.index({ status: 1, priority: 1 });
MaintenanceSchema.index({ department: 1, status: 1 });
MaintenanceSchema.index({ assignedTo: 1, status: 1 });
MaintenanceSchema.index({ assetId: 1 });
MaintenanceSchema.index({ scheduledDate: 1, status: 1 });
MaintenanceSchema.index({ type: 1, status: 1 });
MaintenanceSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const Maintenance = mongoose_1.default.models.Maintenance || mongoose_1.default.model('Maintenance', MaintenanceSchema);
exports.default = Maintenance;
