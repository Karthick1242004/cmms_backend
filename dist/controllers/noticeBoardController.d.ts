import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        department: string;
        role: string;
    };
}
export declare const getAllNoticeBoard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getNoticeBoardById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createNoticeBoard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateNoticeBoard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteNoticeBoard: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const togglePublishNotice: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getNoticeBoardStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=noticeBoardController.d.ts.map