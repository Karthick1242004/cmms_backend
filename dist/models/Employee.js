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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const WorkHistorySchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    type: {
        type: String,
        enum: ['ticket', 'maintenance', 'daily-log', 'safety-inspection'],
        required: true
    },
    referenceId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    assetId: { type: String },
    assetName: { type: String },
    duration: { type: Number },
    priority: { type: String }
});
const AssetAssignmentSchema = new mongoose_1.Schema({
    assetId: { type: String, required: true },
    assetName: { type: String, required: true },
    assignedDate: { type: Date, required: true },
    unassignedDate: { type: Date },
    status: {
        type: String,
        enum: ['active', 'completed', 'transferred'],
        default: 'active'
    },
    role: {
        type: String,
        enum: ['primary', 'secondary', 'temporary'],
        default: 'primary'
    },
    notes: { type: String }
});
const PerformanceMetricsSchema = new mongoose_1.Schema({
    totalTasksCompleted: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 },
    ticketsResolved: { type: Number, default: 0 },
    maintenanceCompleted: { type: Number, default: 0 },
    safetyInspectionsCompleted: { type: Number, default: 0 },
    dailyLogEntries: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    efficiency: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 3, min: 1, max: 5 }
});
const ShiftInfoSchema = new mongoose_1.Schema({
    shiftType: {
        type: String,
        enum: ['day', 'night', 'rotating', 'on-call'],
        required: true
    },
    shiftStartTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    shiftEndTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    workDays: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: []
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    effectiveDate: {
        type: Date,
        default: Date.now
    }
});
const EmployeeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required'],
        trim: true,
        maxlength: [100, 'Employee name cannot exceed 100 characters'],
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ],
        index: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [
            /^[\+]?[\d\s\-\(\)]+$/,
            'Please enter a valid phone number'
        ],
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters'],
        index: true,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        maxlength: [100, 'Role cannot exceed 100 characters'],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'on-leave'],
            message: 'Status must be active, inactive, or on-leave',
        },
        default: 'active',
        index: true,
    },
    avatar: {
        type: String,
        trim: true,
        default: '/placeholder-user.jpg',
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    lastLoginAt: {
        type: Date,
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    supervisor: {
        type: String,
        trim: true,
    },
    skills: [{
            type: String,
            trim: true,
        }],
    certifications: [{
            type: String,
            trim: true,
        }],
    emergencyContact: {
        name: { type: String, trim: true },
        relationship: { type: String, trim: true },
        phone: { type: String, trim: true },
    },
    shiftInfo: {
        type: ShiftInfoSchema,
        default: null,
    },
    workHistory: {
        type: [WorkHistorySchema],
        default: [],
    },
    assetAssignments: {
        type: [AssetAssignmentSchema],
        default: [],
    },
    currentAssignments: [{
            type: String,
            trim: true,
        }],
    performanceMetrics: {
        type: PerformanceMetricsSchema,
        default: () => ({}),
    },
    totalWorkHours: {
        type: Number,
        default: 0,
    },
    productivityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    reliabilityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    accessLevel: {
        type: String,
        enum: ['super_admin', 'department_admin', 'normal_user'],
        default: 'normal_user',
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
EmployeeSchema.index({ name: 1, status: 1 });
EmployeeSchema.index({ department: 1, role: 1 });
EmployeeSchema.index({ email: 1, status: 1 });
EmployeeSchema.virtual('contactInfo').get(function () {
    return `${this.name} - ${this.email} (${this.phone})`;
});
EmployeeSchema.virtual('displayName').get(function () {
    return `${this.name} - ${this.department} (${this.role})`;
});
EmployeeSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcryptjs_1.default.genSalt(12);
            this.password = await bcryptjs_1.default.hash(this.password, salt);
        }
        if (this.name) {
            this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
        }
        if (this.department) {
            this.department = this.department.charAt(0).toUpperCase() + this.department.slice(1);
        }
        if (this.role) {
            this.role = this.role.charAt(0).toUpperCase() + this.role.slice(1);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
EmployeeSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error('Password comparison failed');
    }
};
EmployeeSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    },
});
const Employee = mongoose_1.default.model('Employee', EmployeeSchema);
exports.default = Employee;
