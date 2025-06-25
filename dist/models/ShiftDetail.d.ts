import mongoose, { Document } from 'mongoose';
export interface IShiftDetail extends Document {
    _id: string;
    employeeId: number;
    employeeName: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    shiftType: 'day' | 'night' | 'rotating' | 'on-call';
    shiftStartTime: string;
    shiftEndTime: string;
    workDays: string[];
    supervisor: string;
    location: string;
    status: 'active' | 'inactive' | 'on-leave';
    joinDate: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ShiftDetail: mongoose.Model<IShiftDetail, {}, {}, {}, mongoose.Document<unknown, {}, IShiftDetail, {}> & IShiftDetail & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default ShiftDetail;
//# sourceMappingURL=ShiftDetail.d.ts.map