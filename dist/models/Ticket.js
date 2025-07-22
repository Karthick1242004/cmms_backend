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
const TicketSchema = new mongoose_1.Schema({
    ticketId: {
        type: String,
        unique: true,
        index: true,
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: {
            values: ['Low', 'Medium', 'High', 'Critical'],
            message: 'Priority must be Low, Medium, High, or Critical',
        },
        default: 'Medium',
        index: true,
    },
    loggedDateTime: {
        type: Date,
        required: [true, 'Logged date time is required'],
        default: Date.now,
        index: true,
    },
    loggedBy: {
        type: String,
        required: [true, 'Logged by is required'],
        trim: true,
        maxlength: [100, 'Logged by cannot exceed 100 characters'],
        index: true,
    },
    reportedVia: {
        type: String,
        required: [true, 'Reported via is required'],
        enum: {
            values: ['Phone', 'Email', 'In-Person', 'Mobile App', 'Web Portal'],
            message: 'Reported via must be one of: Phone, Email, In-Person, Mobile App, Web Portal',
        },
    },
    company: {
        type: String,
        required: [true, 'Company is required'],
        trim: true,
        maxlength: [200, 'Company cannot exceed 200 characters'],
        index: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters'],
        index: true,
    },
    area: {
        type: String,
        required: [true, 'Area is required'],
        trim: true,
        maxlength: [100, 'Area cannot exceed 100 characters'],
    },
    inCharge: {
        type: String,
        required: [true, 'In-charge is required'],
        trim: true,
        maxlength: [100, 'In-charge cannot exceed 100 characters'],
    },
    equipmentId: {
        type: String,
        trim: true,
        index: true,
    },
    reviewedBy: {
        type: String,
        trim: true,
        maxlength: [100, 'Reviewed by cannot exceed 100 characters'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
            message: 'Status must be Open, In Progress, Pending, Resolved, or Closed',
        },
        default: 'Open',
        index: true,
    },
    ticketCloseDate: {
        type: Date,
        index: true,
    },
    totalTime: {
        type: Number,
        min: [0, 'Total time cannot be negative'],
    },
    reportType: {
        service: {
            type: Boolean,
            default: false,
        },
        maintenance: {
            type: Boolean,
            default: false,
        },
        incident: {
            type: Boolean,
            default: false,
        },
        breakdown: {
            type: Boolean,
            default: false,
        },
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    solution: {
        type: String,
        trim: true,
        maxlength: [2000, 'Solution cannot exceed 2000 characters'],
    },
    isOpenTicket: {
        type: Boolean,
        default: false,
        index: true,
    },
    assignedDepartments: [{
            type: String,
            trim: true,
            maxlength: [100, 'Department name cannot exceed 100 characters'],
        }],
    assignedUsers: [{
            type: String,
            trim: true,
            maxlength: [100, 'User name cannot exceed 100 characters'],
        }],
    activityLog: [{
            date: {
                type: Date,
                required: true,
                default: Date.now,
            },
            duration: {
                type: Number,
                min: [0, 'Duration cannot be negative'],
            },
            loggedBy: {
                type: String,
                required: true,
                trim: true,
                maxlength: [100, 'Logged by cannot exceed 100 characters'],
            },
            remarks: {
                type: String,
                required: true,
                trim: true,
                maxlength: [500, 'Remarks cannot exceed 500 characters'],
            },
            action: {
                type: String,
                required: true,
                enum: {
                    values: ['Created', 'Updated', 'Assigned', 'Comment', 'Status Change', 'Closed'],
                    message: 'Action must be one of: Created, Updated, Assigned, Comment, Status Change, Closed',
                },
            },
        }],
}, {
    timestamps: true,
    versionKey: false,
});
// Indexes for better query performance
TicketSchema.index({ department: 1, status: 1 });
TicketSchema.index({ equipmentId: 1, status: 1 });
TicketSchema.index({ priority: 1, loggedDateTime: -1 });
TicketSchema.index({ assignedDepartments: 1, isOpenTicket: 1 });
TicketSchema.index({ loggedBy: 1, status: 1 });
TicketSchema.index({ subject: 'text', description: 'text' }); // Text search
// Pre-save middleware to auto-generate ticket ID
TicketSchema.pre('save', async function (next) {
    if (this.isNew && !this.ticketId) {
        const currentYear = new Date().getFullYear();
        const count = await mongoose_1.default.model('Ticket').countDocuments({
            ticketId: { $regex: `^TKT-${currentYear}-` }
        });
        this.ticketId = `TKT-${currentYear}-${String(count + 1).padStart(6, '0')}`;
    }
    // Auto-close ticket when status is set to 'Closed'
    if (this.status === 'Closed' && !this.ticketCloseDate) {
        this.ticketCloseDate = new Date();
    }
    // Calculate total time if ticket is closed
    if (this.status === 'Closed' && this.ticketCloseDate && this.loggedDateTime) {
        const totalMs = this.ticketCloseDate.getTime() - this.loggedDateTime.getTime();
        this.totalTime = Math.round(totalMs / (1000 * 60 * 60)); // Convert to hours
    }
    next();
});
// Pre-save middleware to add activity log entry
TicketSchema.pre('save', function (next) {
    if (this.isNew) {
        this.activityLog.push({
            date: new Date(),
            loggedBy: this.loggedBy,
            remarks: 'Ticket created',
            action: 'Created',
        });
    }
    next();
});
// Virtual for display status with priority
TicketSchema.virtual('displayStatus').get(function () {
    return `${this.status} (${this.priority} Priority)`;
});
// Virtual for time since logged
TicketSchema.virtual('timeSinceLogged').get(function () {
    const now = new Date();
    const diffMs = now.getTime() - this.loggedDateTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${Math.max(1, diffMinutes)} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
});
// Transform to frontend format
TicketSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const Ticket = mongoose_1.default.model('Ticket', TicketSchema);
exports.default = Ticket;
//# sourceMappingURL=Ticket.js.map