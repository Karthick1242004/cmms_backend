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
const PartSchema = new mongoose_1.Schema({
    partNumber: {
        type: String,
        required: [true, 'Part number is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Part number cannot exceed 50 characters'],
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Part name is required'],
        trim: true,
        maxlength: [200, 'Part name cannot exceed 200 characters'],
        index: true,
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'SKU cannot exceed 50 characters'],
        index: true,
    },
    materialCode: {
        type: String,
        required: [true, 'Material code is required'],
        trim: true,
        maxlength: [50, 'Material code cannot exceed 50 characters'],
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        maxlength: [100, 'Category cannot exceed 100 characters'],
        index: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters'],
        index: true,
    },
    linkedAssets: [{
            assetId: {
                type: String,
                required: true,
                index: true,
            },
            assetName: {
                type: String,
                required: true,
                trim: true,
            },
            assetDepartment: {
                type: String,
                required: true,
                trim: true,
                index: true,
            },
            quantityInAsset: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1'],
            },
            lastUsed: {
                type: String,
                trim: true,
            },
            replacementFrequency: {
                type: Number,
                min: [0, 'Replacement frequency cannot be negative'],
            },
            criticalLevel: {
                type: String,
                enum: {
                    values: ['low', 'medium', 'high'],
                    message: 'Critical level must be low, medium, or high',
                },
                default: 'medium',
            },
        }],
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        index: true,
    },
    minStockLevel: {
        type: Number,
        required: [true, 'Minimum stock level is required'],
        min: [0, 'Minimum stock level cannot be negative'],
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price cannot be negative'],
    },
    totalValue: {
        type: Number,
        default: function () {
            return this.quantity * this.unitPrice;
        },
    },
    supplier: {
        type: String,
        required: [true, 'Supplier is required'],
        trim: true,
        maxlength: [200, 'Supplier cannot exceed 200 characters'],
        index: true,
    },
    supplierCode: {
        type: String,
        trim: true,
        maxlength: [50, 'Supplier code cannot exceed 50 characters'],
    },
    leadTime: {
        type: Number,
        min: [0, 'Lead time cannot be negative'],
    },
    lastPurchaseDate: {
        type: String,
        trim: true,
    },
    lastPurchasePrice: {
        type: Number,
        min: [0, 'Last purchase price cannot be negative'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters'],
        index: true,
    },
    alternativeLocations: [{
            type: String,
            trim: true,
            maxlength: [200, 'Alternative location cannot exceed 200 characters'],
        }],
    totalConsumed: {
        type: Number,
        default: 0,
        min: [0, 'Total consumed cannot be negative'],
    },
    averageMonthlyUsage: {
        type: Number,
        default: 0,
        min: [0, 'Average monthly usage cannot be negative'],
    },
    lastUsedDate: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'discontinued'],
            message: 'Status must be active, inactive, or discontinued',
        },
        default: 'active',
        index: true,
    },
    isStockItem: {
        type: Boolean,
        default: true,
        index: true,
    },
    isCritical: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
PartSchema.index({ department: 1, status: 1 });
PartSchema.index({ 'linkedAssets.assetDepartment': 1 });
PartSchema.index({ quantity: 1, minStockLevel: 1 });
PartSchema.index({ category: 1, department: 1 });
PartSchema.index({ totalValue: -1 });
PartSchema.index({ isCritical: 1, quantity: 1 });
PartSchema.virtual('stockStatus').get(function () {
    if (this.quantity <= 0)
        return 'out_of_stock';
    if (this.quantity <= this.minStockLevel)
        return 'low_stock';
    return 'in_stock';
});
PartSchema.virtual('departmentsServed').get(function () {
    const departments = this.linkedAssets?.map(asset => asset.assetDepartment) || [];
    return [...new Set(departments)];
});
PartSchema.pre('save', function (next) {
    this.totalValue = this.quantity * this.unitPrice;
    next();
});
PartSchema.statics.getPartsByDepartment = function (department) {
    return this.find({
        $or: [
            { department: department },
            { 'linkedAssets.assetDepartment': department }
        ],
        status: 'active'
    });
};
PartSchema.statics.getPartsByAsset = function (assetId) {
    return this.find({
        'linkedAssets.assetId': assetId,
        status: 'active'
    });
};
PartSchema.statics.getLowStockParts = function (department) {
    const query = {
        $expr: { $lte: ['$quantity', '$minStockLevel'] },
        status: 'active'
    };
    if (department) {
        query.$or = [
            { department: department },
            { 'linkedAssets.assetDepartment': department }
        ];
    }
    return this.find(query);
};
const Part = mongoose_1.default.model('Part', PartSchema);
exports.default = Part;
