import { Request, Response } from 'express';
export declare class MaintenanceController {
    static getAllSchedules(req: Request, res: Response): Promise<void>;
    static getScheduleById(req: Request, res: Response): Promise<void>;
    static createSchedule(req: Request, res: Response): Promise<void>;
    static updateSchedule(req: Request, res: Response): Promise<void>;
    static deleteSchedule(req: Request, res: Response): Promise<void>;
    static getAllRecords(req: Request, res: Response): Promise<void>;
    static getRecordById(req: Request, res: Response): Promise<void>;
    static createRecord(req: Request, res: Response): Promise<void>;
    static updateRecord(req: Request, res: Response): Promise<void>;
    static verifyRecord(req: Request, res: Response): Promise<void>;
    static deleteRecord(req: Request, res: Response): Promise<void>;
    static getMaintenanceStats(req: Request, res: Response): Promise<void>;
    private static calculateNextDueDate;
}
//# sourceMappingURL=maintenanceController.d.ts.map