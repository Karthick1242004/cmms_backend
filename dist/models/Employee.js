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
            values: ['active', 'inactive'],
            message: 'Status must be either active or inactive',
        },
        default: 'active',
        index: true,
    },
    avatar: {
        type: String,
        trim: true,
        default: '/placeholder-user.jpg',
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
EmployeeSchema.pre('save', function (next) {
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
});
EmployeeSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const Employee = mongoose_1.default.model('Employee', EmployeeSchema);
exports.default = Employee;
