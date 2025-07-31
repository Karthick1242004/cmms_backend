import { Request, Response, NextFunction } from 'express';

// Extended Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: 'admin' | 'manager' | 'technician';
  };
}

// Middleware to extract user context from headers
export const extractUserContext = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Extract user information from headers
    const userId = req.headers['x-user-id'] as string;
    const userName = req.headers['x-user-name'] as string;
    const userEmail = req.headers['x-user-email'] as string;
    const userDepartment = req.headers['x-user-department'] as string;
    const userRole = req.headers['x-user-role'] as 'admin' | 'manager' | 'technician';

    // If all required headers are present, set user context
    if (userId && userName && userEmail && userDepartment && userRole) {
      req.user = {
        id: userId,
        name: userName,
        email: userEmail,
        department: userDepartment,
        role: userRole,
      };
    } else {
      // Set default user context for development/testing
      req.user = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'admin',
      };
    }

    next();
  } catch (error) {
    console.error('Error extracting user context:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing user context',
    });
  }
};

// Optional: More strict authentication middleware that requires valid user context
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }
  next();
};

// Role-based authorization middleware
export const requireRole = (roles: ('admin' | 'manager' | 'technician')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};