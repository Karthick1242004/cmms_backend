import mongoose, { Document } from 'mongoose';
export interface IDailyLogActivity extends Document {
    _id: string;
    date: Date;
    time: string;
    area: string;
    departmentId: string;
    departmentName: string;
    assetId: string;
    assetName: string;
    natureOfProblem: string;
    commentsOrSolution: string;
    attendedBy: string;
    attendedByName: string;
    verifiedBy?: string;
    verifiedByName?: string;
    status: 'open' | 'in-progress' | 'resolved' | 'verified';
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const DailyLogActivity: mongoose.Model<IDailyLogActivity, {}, {}, {}, mongoose.Document<unknown, {}, IDailyLogActivity, {}> & IDailyLogActivity & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default DailyLogActivity;
//# sourceMappingURL=DailyLogActivity.d.ts.map