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
const ShiftDetailSchema = new mongoose_1.Schema({
    employeeId: {
        type: Number,
        required: [true, 'Employee ID is required'],
        unique: true,
        index: true,
    },
    employeeName: {
        type: String,
        required: [true, 'Employee name is required'],
        trim: true,
        maxlength: [100, 'Employee name cannot exceed 100 characters'],
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        unique: true,
        index: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [50, 'Department cannot exceed 50 characters'],
        index: true,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    shiftType: {
        type: String,
        enum: {
            values: ['day', 'night', 'rotating', 'on-call'],
            message: 'Shift type must be day, night, rotating, or on-call',
        },
        required: [true, 'Shift type is required'],
        index: true,
    },
    shiftStartTime: {
        type: String,
        required: [true, 'Shift start time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
    },
    shiftEndTime: {
        type: String,
        required: [true, 'Shift end time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
    },
    workDays: {
        type: [String],
        enum: {
            values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            message: 'Work days must be valid day names',
        },
        default: [],
        validate: {
            validator: function (array) {
                return array.length <= 7 && array.length >= 0;
            },
            message: 'Work days cannot exceed 7 days',
        },
    },
    supervisor: {
        type: String,
        required: [true, 'Supervisor is required'],
        trim: true,
        maxlength: [100, 'Supervisor name cannot exceed 100 characters'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters'],
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
    joinDate: {
        type: String,
        required: [true, 'Join date is required'],
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date format (YYYY-MM-DD)'],
    },
    avatar: {
        type: String,
        trim: true,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
ShiftDetailSchema.index({ employeeName: 1, department: 1 });
ShiftDetailSchema.index({ shiftType: 1, status: 1 });
ShiftDetailSchema.index({ supervisor: 1 });
ShiftDetailSchema.index({ location: 1, department: 1 });
ShiftDetailSchema.virtual('displayInfo').get(function () {
    return `${this.employeeName} - ${this.department} (${this.shiftType} shift)`;
});
ShiftDetailSchema.pre('save', function (next) {
    if (this.employeeName) {
        this.employeeName = this.employeeName.charAt(0).toUpperCase() + this.employeeName.slice(1);
    }
    if (this.supervisor) {
        this.supervisor = this.supervisor.charAt(0).toUpperCase() + this.supervisor.slice(1);
    }
    next();
});
ShiftDetailSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret.employeeId;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const ShiftDetail = mongoose_1.default.model('ShiftDetail', ShiftDetailSchema);
exports.default = ShiftDetail;
