import { Request, Response } from 'express';
export declare class EmployeeController {
    static getAllEmployees(req: Request, res: Response): Promise<void>;
    static getEmployeeById(req: Request, res: Response): Promise<void>;
    static createEmployee(req: Request, res: Response): Promise<void>;
    static updateEmployee(req: Request, res: Response): Promise<void>;
    static deleteEmployee(req: Request, res: Response): Promise<void>;
    static getEmployeeStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=employeeController.d.ts.map