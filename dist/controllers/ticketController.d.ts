import { Request, Response } from 'express';
export declare class TicketController {
    static getAllTickets(req: Request, res: Response): Promise<void>;
    static getTicketById(req: Request, res: Response): Promise<void>;
    static createTicket(req: Request, res: Response): Promise<void>;
    static updateTicket(req: Request, res: Response): Promise<void>;
    static updateTicketStatus(req: Request, res: Response): Promise<void>;
    static assignTicket(req: Request, res: Response): Promise<void>;
    static addActivityLog(req: Request, res: Response): Promise<void>;
    static getTicketsByDepartment(req: Request, res: Response): Promise<void>;
    static getTicketsByAsset(req: Request, res: Response): Promise<void>;
    static getMyTickets(req: Request, res: Response): Promise<void>;
    static getTicketStats(req: Request, res: Response): Promise<void>;
    static deleteTicket(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ticketController.d.ts.map