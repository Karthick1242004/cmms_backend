import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        department: string;
        role: 'admin' | 'user';
    };
}
export declare const extractUserContext: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (roles: ("admin" | "user")[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map