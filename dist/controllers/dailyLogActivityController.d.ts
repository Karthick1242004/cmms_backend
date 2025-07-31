import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare const getAllDailyLogActivities: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getDailyLogActivityById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createDailyLogActivity: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateDailyLogActivity: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteDailyLogActivity: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateDailyLogActivityStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getDailyLogActivityStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getAssetsByDepartment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=dailyLogActivityController.d.ts.map