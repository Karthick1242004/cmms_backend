"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = exports.extractUserContext = void 0;
// Middleware to extract user context from headers
const extractUserContext = (req, res, next) => {
    try {
        // Extract user information from headers
        const userId = req.headers['x-user-id'];
        const userName = req.headers['x-user-name'];
        const userEmail = req.headers['x-user-email'];
        const userDepartment = req.headers['x-user-department'];
        const userRole = req.headers['x-user-role'];
        // If all required headers are present, set user context
        if (userId && userName && userEmail && userDepartment && userRole) {
            req.user = {
                id: userId,
                name: userName,
                email: userEmail,
                department: userDepartment,
                role: userRole,
            };
        }
        else {
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
    }
    catch (error) {
        console.error('Error extracting user context:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while processing user context',
        });
    }
};
exports.extractUserContext = extractUserContext;
// Optional: More strict authentication middleware that requires valid user context
const requireAuth = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
// Role-based authorization middleware
const requireRole = (roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
//# sourceMappingURL=authMiddleware.js.map