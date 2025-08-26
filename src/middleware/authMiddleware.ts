import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Logger from '../utils/logger';

// Enhanced user interface with access levels
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: 'admin' | 'manager' | 'technician';
    accessLevel: 'super_admin' | 'department_admin' | 'normal_user';
    employeeId?: string;
  };
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
  employeeId?: string;
  iat: number;
  exp: number;
}

// Validate JWT secret at startup
const validateJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    Logger.error('CRITICAL: JWT_SECRET environment variable is not set');
    process.exit(1);
  }
  
  if (secret.length < 32) {
    Logger.error('CRITICAL: JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }
  
  if (secret === 'your-super-secret-jwt-key-for-development-only') {
    Logger.warn('WARNING: Using default JWT secret. Change this in production!');
  }
  
  return secret;
};

// Initialize and validate JWT secret
const JWT_SECRET = validateJWTSecret();

// Core JWT validation middleware - REQUIRED for all protected routes
export const validateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7)
      : req.cookies?.['auth-token'];

    if (!token) {
      Logger.warn(`Authentication attempt without token from IP: ${req.ip}`);
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_TOKEN'
      });
      return;
    }

    // Verify JWT token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (jwtError: any) {
      Logger.warn(`Invalid JWT token from IP: ${req.ip}, Error: ${jwtError.message}`);
      
      if (jwtError.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
        return;
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
        return;
      }
      
      res.status(401).json({
        success: false,
        message: 'Token validation failed',
        code: 'TOKEN_INVALID'
      });
      return;
    }

    // Validate token payload
    if (!decoded.userId || !decoded.email || !decoded.role || !decoded.department) {
      Logger.warn(`Invalid token payload from IP: ${req.ip}`);
      res.status(401).json({
        success: false,
        message: 'Invalid token payload',
        code: 'INVALID_PAYLOAD'
      });
      return;
    }

    // Set authenticated user context
    const userContext: AuthenticatedRequest['user'] = {
      id: decoded.userId,
      name: decoded.email?.split('@')[0] || 'Unknown User', // Fallback name from email
      email: decoded.email,
      department: decoded.department,
      role: decoded.role as 'admin' | 'manager' | 'technician',
      accessLevel: decoded.accessLevel as 'super_admin' | 'department_admin' | 'normal_user'
    };

    // Only add employeeId if it exists
    if (decoded.employeeId) {
      userContext.employeeId = decoded.employeeId;
    }

    req.user = userContext;

    Logger.info(`Authenticated user: ${decoded.email} (${decoded.role}) from IP: ${req.ip}`);
    next();

  } catch (error) {
    Logger.error('JWT validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service error',
      code: 'AUTH_ERROR'
    });
    return;
  }
};

// Enhanced role-based authorization middleware
export const requireRole = (roles: ('admin' | 'manager' | 'technician')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      Logger.warn(`Unauthorized access attempt to role-protected route from IP: ${req.ip}`);
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      Logger.warn(`Access denied for user ${req.user.email} (${req.user.role}) to role-protected route requiring: ${roles.join(', ')}`);
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_ROLE',
        required: roles,
        current: req.user.role
      });
      return;
    }

    next();
  };
};

// Access level-based authorization middleware (more granular than roles)
export const requireAccessLevel = (levels: ('super_admin' | 'department_admin' | 'normal_user')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      Logger.warn(`Unauthorized access attempt to access-level protected route from IP: ${req.ip}`);
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
      return;
    }

    if (!levels.includes(req.user.accessLevel)) {
      Logger.warn(`Access denied for user ${req.user.email} (${req.user.accessLevel}) to access-level protected route requiring: ${levels.join(', ')}`);
      res.status(403).json({
        success: false,
        message: 'Insufficient access level',
        code: 'INSUFFICIENT_ACCESS',
        required: levels,
        current: req.user.accessLevel
      });
      return;
    }

    next();
  };
};

// Department-based authorization middleware
export const requireDepartment = (departments: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      Logger.warn(`Unauthorized access attempt to department-protected route from IP: ${req.ip}`);
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
      return;
    }

    // Super admins can access any department
    if (req.user.accessLevel === 'super_admin') {
      next();
      return;
    }

    if (!departments.includes(req.user.department)) {
      Logger.warn(`Department access denied for user ${req.user.email} (${req.user.department}) to route requiring: ${departments.join(', ')}`);
      res.status(403).json({
        success: false,
        message: 'Department access denied',
        code: 'DEPARTMENT_ACCESS_DENIED',
        required: departments,
        current: req.user.department
      });
      return;
    }

    next();
  };
};

// Combined middleware for complex authorization scenarios
export const requireAuth = (options: {
  roles?: ('admin' | 'manager' | 'technician')[];
  accessLevels?: ('super_admin' | 'department_admin' | 'normal_user')[];
  departments?: string[];
  allowSuperAdmin?: boolean;
} = {}) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      Logger.warn(`Unauthorized access attempt from IP: ${req.ip} to protected route: ${req.path}`);
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
      return;
    }

    // Allow super admin to bypass all checks if specified
    if (options.allowSuperAdmin !== false && req.user.accessLevel === 'super_admin') {
      next();
      return;
    }

    // Check role requirements
    if (options.roles && !options.roles.includes(req.user.role)) {
      Logger.warn(`Role access denied for user ${req.user.email} (${req.user.role}) to route requiring: ${options.roles.join(', ')}`);
      res.status(403).json({
        success: false,
        message: 'Insufficient role permissions',
        code: 'INSUFFICIENT_ROLE'
      });
      return;
    }

    // Check access level requirements
    if (options.accessLevels && !options.accessLevels.includes(req.user.accessLevel)) {
      Logger.warn(`Access level denied for user ${req.user.email} (${req.user.accessLevel}) to route requiring: ${options.accessLevels.join(', ')}`);
      res.status(403).json({
        success: false,
        message: 'Insufficient access level',
        code: 'INSUFFICIENT_ACCESS'
      });
      return;
    }

    // Check department requirements
    if (options.departments && !options.departments.includes(req.user.department)) {
      Logger.warn(`Department access denied for user ${req.user.email} (${req.user.department}) to route requiring: ${options.departments.join(', ')}`);
      res.status(403).json({
        success: false,
        message: 'Department access denied',
        code: 'DEPARTMENT_ACCESS_DENIED'
      });
      return;
    }

    next();
  };
};

// Utility function to check if user can modify resources from specific departments
export const canAccessDepartmentData = (user: AuthenticatedRequest['user'], targetDepartment: string): boolean => {
  if (!user) return false;
  
  // Super admins can access all departments
  if (user.accessLevel === 'super_admin') return true;
  
  // Department admins can access their own department
  if (user.accessLevel === 'department_admin' && user.department === targetDepartment) return true;
  
  // Normal users can only access their own department
  if (user.department === targetDepartment) return true;
  
  return false;
};

// Middleware to ensure user can only access their department's data (unless super admin)
export const enforceDepartmentAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'NO_AUTH'
    });
    return;
  }

  // Super admins can access all data
  if (req.user.accessLevel === 'super_admin') {
    next();
    return;
  }

  // Add department filter to query parameters for non-super admins
  req.query.department = req.user.department;
  
  next();
};