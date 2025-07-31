import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare class MeetingMinutesController {
    static getAllMeetingMinutes(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getMeetingMinutesById(req: AuthenticatedRequest, res: Response): Promise<void>;
    static createMeetingMinutes(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateMeetingMinutes(req: AuthenticatedRequest, res: Response): Promise<void>;
    static deleteMeetingMinutes(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getMeetingMinutesStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateActionItemStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=meetingMinutesController.d.ts.map