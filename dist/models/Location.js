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
const LocationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true,
        maxlength: [100, 'Location name cannot exceed 100 characters'],
        index: true,
    },
    code: {
        type: String,
        required: [true, 'Location code is required'],
        trim: true,
        maxlength: [20, 'Location code cannot exceed 20 characters'],
        unique: true,
        index: true,
    },
    type: {
        type: String,
        required: [true, 'Location type is required'],
        trim: true,
        maxlength: [50, 'Location type cannot exceed 50 characters'],
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Location description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters'],
        index: true,
    },
    parentLocation: {
        type: String,
        default: '',
        trim: true,
        maxlength: [100, 'Parent location cannot exceed 100 characters'],
    },
    assetCount: {
        type: Number,
        default: 0,
        min: [0, 'Asset count cannot be negative'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters'],
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
}, {
    timestamps: true,
    versionKey: false,
});
LocationSchema.index({ name: 1, status: 1 });
LocationSchema.index({ code: 1 });
LocationSchema.index({ department: 1 });
LocationSchema.index({ type: 1 });
LocationSchema.index({ parentLocation: 1 });
LocationSchema.virtual('displayInfo').get(function () {
    return `${this.name} (${this.code}) - ${this.type}`;
});
LocationSchema.pre('save', function (next) {
    if (this.name) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    if (this.type) {
        this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
    }
    if (this.department) {
        this.department = this.department.charAt(0).toUpperCase() + this.department.slice(1);
    }
    next();
});
LocationSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const Location = mongoose_1.default.model('Location', LocationSchema);
exports.default = Location;
