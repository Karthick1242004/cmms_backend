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
const DailyLogActivitySchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    time: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    departmentId: {
        type: String,
        required: true,
        index: true
    },
    departmentName: {
        type: String,
        required: true,
        trim: true
    },
    assetId: {
        type: String,
        required: true,
        index: true
    },
    assetName: {
        type: String,
        required: true,
        trim: true
    },
    natureOfProblem: {
        type: String,
        required: true,
        trim: true
    },
    commentsOrSolution: {
        type: String,
        required: true,
        trim: true
    },
    attendedBy: {
        type: String,
        required: true,
        index: true
    },
    attendedByName: {
        type: String,
        required: true,
        trim: true
    },
    verifiedBy: {
        type: String,
        index: true
    },
    verifiedByName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'verified'],
        default: 'open',
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
        index: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdByName: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    collection: 'dailylogactivities'
});
// Indexes for better query performance
DailyLogActivitySchema.index({ date: -1 });
DailyLogActivitySchema.index({ departmentId: 1, date: -1 });
DailyLogActivitySchema.index({ assetId: 1, date: -1 });
DailyLogActivitySchema.index({ attendedBy: 1, date: -1 });
DailyLogActivitySchema.index({ status: 1, priority: 1 });
const DailyLogActivity = mongoose_1.default.model('DailyLogActivity', DailyLogActivitySchema);
exports.default = DailyLogActivity;
//# sourceMappingURL=DailyLogActivity.js.map