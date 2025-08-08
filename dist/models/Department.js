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
const DepartmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        maxlength: [50, 'Department name cannot exceed 50 characters'],
        unique: true,
        index: true,
    },
    code: {
        type: String,
        required: [true, 'Department code is required'],
        trim: true,
        maxlength: [10, 'Department code cannot exceed 10 characters'],
        unique: true,
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    manager: {
        type: String,
        trim: true,
        index: true,
    },
    employeeCount: {
        type: Number,
        default: 0,
        min: [0, 'Employee count cannot be negative'],
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: 'Status must be active or inactive',
        },
        default: 'active',
        index: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
DepartmentSchema.index({ name: 1, status: 1 });
DepartmentSchema.index({ code: 1, status: 1 });
DepartmentSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const Department = mongoose_1.default.models.Department || mongoose_1.default.model('Department', DepartmentSchema);
exports.default = Department;
