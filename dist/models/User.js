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
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return this.authMethod === 'email';
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    authMethod: {
        type: String,
        enum: ['email', 'oauth'],
        required: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'technician'],
        default: 'technician'
    },
    department: {
        type: String,
        required: true,
        default: 'General'
    },
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    jobTitle: String,
    employeeId: {
        type: String,
        unique: true,
        sparse: true
    },
    startDate: Date,
    bio: String,
    profileCompleted: {
        type: Boolean,
        default: false
    },
    profileCompletionFields: {
        type: [String],
        default: []
    },
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    preferences: {
        compactView: {
            type: Boolean,
            default: false
        },
        darkMode: {
            type: Boolean,
            default: false
        }
    },
    lastLoginAt: Date
}, {
    timestamps: true
});
UserSchema.index({ authMethod: 1, email: 1 });
UserSchema.index({ department: 1, role: 1 });
UserSchema.methods.checkProfileCompletion = function () {
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'country', 'jobTitle', 'bio'];
    const missingFields = requiredFields.filter(field => !this[field]);
    this.profileCompletionFields = missingFields;
    this.profileCompleted = missingFields.length === 0;
    return {
        isComplete: this.profileCompleted,
        missingFields: missingFields,
        completionPercentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100)
    };
};
UserSchema.methods.getInitials = function () {
    return this.name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
UserSchema.virtual('fullName').get(function () {
    if (this.firstName && this.lastName) {
        return `${this.firstName} ${this.lastName}`;
    }
    return this.name;
});
exports.default = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
