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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Counter_1 = __importDefault(require("./Counter"));
const TicketSchema = new mongoose_1.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Ticket title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Ticket description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['open', 'in-progress', 'pending', 'completed', 'cancelled'],
            message: 'Status must be open, in-progress, pending, completed, or cancelled',
        },
        default: 'open',
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
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        maxlength: [50, 'Category cannot exceed 50 characters'],
        index: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [50, 'Department cannot exceed 50 characters'],
        index: true,
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
    assetId: {
        type: String,
        trim: true,
        index: true,
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    estimatedHours: {
        type: Number,
        min: [0, 'Estimated hours cannot be negative'],
    },
    actualHours: {
        type: Number,
        min: [0, 'Actual hours cannot be negative'],
    },
    startDate: {
        type: Date,
    },
    dueDate: {
        type: Date,
    },
    completedDate: {
        type: Date,
    },
    attachments: [{
            type: String,
            trim: true,
        }],
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    activityLog: [{
            date: {
                type: Date,
                default: Date.now,
                required: true,
            },
            loggedBy: {
                type: String,
                required: true,
                trim: true,
            },
            remarks: {
                type: String,
                required: true,
                trim: true,
                maxlength: [1000, 'Remarks cannot exceed 1000 characters'],
            },
            action: {
                type: String,
                trim: true,
                maxlength: [50, 'Action cannot exceed 50 characters'],
            },
            duration: {
                type: Number,
                min: [0, 'Duration cannot be negative'],
            },
        }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
TicketSchema.index({ status: 1, priority: 1 });
TicketSchema.index({ department: 1, status: 1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ createdBy: 1 });
TicketSchema.index({ assetId: 1 });
TicketSchema.index({ dueDate: 1, status: 1 });
TicketSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
TicketSchema.pre('validate', async function (next) {
    try {
        if (this.isNew && !this.ticketId) {
            const year = new Date().getFullYear();
            const result = await Counter_1.default.findOneAndUpdate({ _id: `ticket_${year}` }, { $inc: { sequence: 1 } }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            });
            this.ticketId = `TKT-${year}-${String(result.sequence).padStart(6, '0')}`;
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
const Ticket = mongoose_1.default.models.Ticket || mongoose_1.default.model('Ticket', TicketSchema);
exports.default = Ticket;
