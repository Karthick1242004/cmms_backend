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
const ShiftInfoSchema = new mongoose_1.Schema({
    shiftType: {
        type: String,
        enum: ['day', 'night', 'rotating', 'on-call'],
        required: true,
    },
    shiftStartTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Invalid time format. Use HH:MM format.'
        }
    },
    shiftEndTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Invalid time format. Use HH:MM format.'
        }
    },
    workDays: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0 && v.length <= 7;
            },
            message: 'Must specify at least one work day and maximum seven days.'
        }
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    effectiveDate: {
        type: Date,
        default: Date.now,
    },
});
const EmployeeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address',
        ],
        index: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [
            /^[\+]?[\d\s\-\(\)]{10,20}$/,
            'Please enter a valid phone number',
        ],
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [50, 'Department name cannot exceed 50 characters'],
        index: true,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        maxlength: [50, 'Role cannot exceed 50 characters'],
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
        index: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
        index: true,
    },
    supervisor: {
        type: String,
        trim: true,
        index: true,
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
    accessLevel: {
        type: String,
        enum: ['super_admin', 'department_admin', 'normal_user'],
        default: 'normal_user',
        index: true,
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    city: {
        type: String,
        trim: true,
        maxlength: [50, 'City cannot exceed 50 characters'],
    },
    country: {
        type: String,
        trim: true,
        maxlength: [50, 'Country cannot exceed 50 characters'],
    },
    jobTitle: {
        type: String,
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
EmployeeSchema.index({ department: 1, status: 1 });
EmployeeSchema.index({ role: 1, status: 1 });
EmployeeSchema.index({ supervisor: 1 });
EmployeeSchema.index({ 'shiftInfo.shiftType': 1 });
EmployeeSchema.index({ accessLevel: 1, department: 1 });
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
const Employee = mongoose_1.default.models.Employee || mongoose_1.default.model('Employee', EmployeeSchema);
exports.default = Employee;
