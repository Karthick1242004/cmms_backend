import { Request, Response, NextFunction } from 'express';
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateNotice: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[];
export declare const validateUpdateNotice: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[];
export declare const validatePublishNotice: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[];
export declare const validateGetNotices: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[];
export declare const validateMarkAsViewed: ((req: Request, res: Response, next: NextFunction) => void)[];
//# sourceMappingURL=noticeBoardValidation.d.ts.map