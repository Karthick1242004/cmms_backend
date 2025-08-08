import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  // Basic Information
  email: string
  password?: string // Optional for OAuth users
  name: string
  avatar?: string
  
  // Authentication
  authMethod: 'email' | 'oauth'
  googleId?: string
  emailVerified?: boolean
  
  // Role & Department
  role: 'admin' | 'manager' | 'technician'
  department: string
  
  // Personal Information
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  
  // Work Information
  jobTitle?: string
  employeeId?: string
  startDate?: Date
  bio?: string
  
  // Profile Completion
  profileCompleted: boolean
  profileCompletionFields: string[]
  
  // Preferences
  notifications: {
    email: boolean
    sms: boolean
  }
  preferences: {
    compactView: boolean
    darkMode: boolean
  }
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

const UserSchema = new Schema<IUser>({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.authMethod === 'email'
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
  
  // Authentication
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
  
  // Role & Department
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
  
  // Personal Information
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  city: String,
  country: String,
  
  // Work Information
  jobTitle: String,
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  startDate: Date,
  bio: String,
  
  // Profile Completion
  profileCompleted: {
    type: Boolean,
    default: false
  },
  profileCompletionFields: {
    type: [String],
    default: []
  },
  
  // Preferences
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
  
  // Timestamps
  lastLoginAt: Date
}, {
  timestamps: true
})

// Additional composite indexes for better query performance
UserSchema.index({ authMethod: 1, email: 1 })
UserSchema.index({ department: 1, role: 1 })

// Method to check profile completion
UserSchema.methods.checkProfileCompletion = function() {
  const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'country', 'jobTitle', 'bio']
  const missingFields = requiredFields.filter(field => !this[field])
  
  this.profileCompletionFields = missingFields
  this.profileCompleted = missingFields.length === 0
  
  return {
    isComplete: this.profileCompleted,
    missingFields: missingFields,
    completionPercentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100)
  }
}

// Method to get user's initials
UserSchema.methods.getInitials = function() {
  return this.name
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`
  }
  return this.name
})

// Export the model
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema) 