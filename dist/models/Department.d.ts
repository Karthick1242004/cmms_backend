import mongoose, { Document } from 'mongoose';
export interface IDepartment extends Document {
    _id: string;
    name: string;
    description: string;
    manager: string;
    employeeCount: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}
declare const Department: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}> & IDepartment & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Department;
//# sourceMappingURL=Department.d.ts.map