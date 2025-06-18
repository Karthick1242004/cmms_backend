import { Request, Response } from 'express';
export declare class DepartmentController {
    static getAllDepartments(req: Request, res: Response): Promise<void>;
    static getDepartmentById(req: Request, res: Response): Promise<void>;
    static createDepartment(req: Request, res: Response): Promise<void>;
    static updateDepartment(req: Request, res: Response): Promise<void>;
    static deleteDepartment(req: Request, res: Response): Promise<void>;
    static getDepartmentStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=departmentController.d.ts.map