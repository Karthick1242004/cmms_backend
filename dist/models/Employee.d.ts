import mongoose, { Document } from 'mongoose';
export interface IEmployee extends Document {
    _id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    status: 'active' | 'inactive';
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Employee: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}> & IEmployee & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Employee;
//# sourceMappingURL=Employee.d.ts.map