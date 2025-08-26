"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceDepartmentAccess = exports.canAccessDepartmentData = exports.requireAuth = exports.requireDepartment = exports.requireAccessLevel = exports.requireRole = exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const validateJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger_1.default.error('CRITICAL: JWT_SECRET environment variable is not set');
        process.exit(1);
    }
    if (secret.length < 32) {
        logger_1.default.error('CRITICAL: JWT_SECRET must be at least 32 characters long');
        process.exit(1);
    }
    if (secret === 'your-super-secret-jwt-key-for-development-only') {
        logger_1.default.warn('WARNING: Using default JWT secret. Change this in production!');
    }
    return secret;
};
const JWT_SECRET = validateJWTSecret();
const validateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.['auth-token'];
        if (!token) {
            logger_1.default.warn(`Authentication attempt without token from IP: ${req.ip}`);
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'NO_TOKEN'
            });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (jwtError) {
            logger_1.default.warn(`Invalid JWT token from IP: ${req.ip}, Error: ${jwtError.message}`);
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
        if (!decoded.userId || !decoded.email || !decoded.role || !decoded.department) {
            logger_1.default.warn(`Invalid token payload from IP: ${req.ip}`);
            res.status(401).json({
                success: false,
                message: 'Invalid token payload',
                code: 'INVALID_PAYLOAD'
            });
            return;
        }
        const userContext = {
            id: decoded.userId,
            name: decoded.email?.split('@')[0] || 'Unknown User',
            email: decoded.email,
            department: decoded.department,
            role: decoded.role,
            accessLevel: decoded.accessLevel
        };
        if (decoded.employeeId) {
            userContext.employeeId = decoded.employeeId;
        }
        req.user = userContext;
        logger_1.default.info(`Authenticated user: ${decoded.email} (${decoded.role}) from IP: ${req.ip}`);
        next();
    }
    catch (error) {
        logger_1.default.error('JWT validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication service error',
            code: 'AUTH_ERROR'
        });
        return;
    }
};
exports.validateJWT = validateJWT;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger_1.default.warn(`Unauthorized access attempt to role-protected route from IP: ${req.ip}`);
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'NO_AUTH'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            logger_1.default.warn(`Access denied for user ${req.user.email} (${req.user.role}) to role-protected route requiring: ${roles.join(', ')}`);
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
exports.requireRole = requireRole;
const requireAccessLevel = (levels) => {
    return (req, res, next) => {
        if (!req.user) {
            logger_1.default.warn(`Unauthorized access attempt to access-level protected route from IP: ${req.ip}`);
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'NO_AUTH'
            });
            return;
        }
        if (!levels.includes(req.user.accessLevel)) {
            logger_1.default.warn(`Access denied for user ${req.user.email} (${req.user.accessLevel}) to access-level protected route requiring: ${levels.join(', ')}`);
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
exports.requireAccessLevel = requireAccessLevel;
const requireDepartment = (departments) => {
    return (req, res, next) => {
        if (!req.user) {
            logger_1.default.warn(`Unauthorized access attempt to department-protected route from IP: ${req.ip}`);
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'NO_AUTH'
            });
            return;
        }
        if (req.user.accessLevel === 'super_admin') {
            next();
            return;
        }
        if (!departments.includes(req.user.department)) {
            logger_1.default.warn(`Department access denied for user ${req.user.email} (${req.user.department}) to route requiring: ${departments.join(', ')}`);
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
exports.requireDepartment = requireDepartment;
const requireAuth = (options = {}) => {
    return (req, res, next) => {
        if (!req.user) {
            logger_1.default.warn(`Unauthorized access attempt from IP: ${req.ip} to protected route: ${req.path}`);
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'NO_AUTH'
            });
            return;
        }
        if (options.allowSuperAdmin !== false && req.user.accessLevel === 'super_admin') {
            next();
            return;
        }
        if (options.roles && !options.roles.includes(req.user.role)) {
            logger_1.default.warn(`Role access denied for user ${req.user.email} (${req.user.role}) to route requiring: ${options.roles.join(', ')}`);
            res.status(403).json({
                success: false,
                message: 'Insufficient role permissions',
                code: 'INSUFFICIENT_ROLE'
            });
            return;
        }
        if (options.accessLevels && !options.accessLevels.includes(req.user.accessLevel)) {
            logger_1.default.warn(`Access level denied for user ${req.user.email} (${req.user.accessLevel}) to route requiring: ${options.accessLevels.join(', ')}`);
            res.status(403).json({
                success: false,
                message: 'Insufficient access level',
                code: 'INSUFFICIENT_ACCESS'
            });
            return;
        }
        if (options.departments && !options.departments.includes(req.user.department)) {
            logger_1.default.warn(`Department access denied for user ${req.user.email} (${req.user.department}) to route requiring: ${options.departments.join(', ')}`);
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
exports.requireAuth = requireAuth;
const canAccessDepartmentData = (user, targetDepartment) => {
    if (!user)
        return false;
    if (user.accessLevel === 'super_admin')
        return true;
    if (user.accessLevel === 'department_admin' && user.department === targetDepartment)
        return true;
    if (user.department === targetDepartment)
        return true;
    return false;
};
exports.canAccessDepartmentData = canAccessDepartmentData;
const enforceDepartmentAccess = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
            code: 'NO_AUTH'
        });
        return;
    }
    if (req.user.accessLevel === 'super_admin') {
        next();
        return;
    }
    req.query.department = req.user.department;
    next();
};
exports.enforceDepartmentAccess = enforceDepartmentAccess;
