import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  _id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  department: string;
  parentLocation: string;
  assetCount: number;
  address: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
LocationSchema.index({ name: 1, status: 1 });
LocationSchema.index({ code: 1 });
LocationSchema.index({ department: 1 });
LocationSchema.index({ type: 1 });
LocationSchema.index({ parentLocation: 1 });

// Virtual for formatted location info
LocationSchema.virtual('displayInfo').get(function() {
  return `${this.name} (${this.code}) - ${this.type}`;
});

// Pre-save middleware to capitalize first letter of name and type
LocationSchema.pre('save', function(next) {
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

// Transform to frontend format
LocationSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Location = mongoose.model<ILocation>('Location', LocationSchema);

export default Location; 