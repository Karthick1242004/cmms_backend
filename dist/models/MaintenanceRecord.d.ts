import mongoose, { Document } from 'mongoose';
export interface IMaintenanceRecord extends Document {
    _id: string;
    scheduleId: string;
    assetId: string;
    assetName: string;
    completedDate: Date;
    startTime: string;
    endTime: string;
    actualDuration: number;
    technician: string;
    technicianId: string;
    status: 'completed' | 'partially_completed' | 'failed' | 'in_progress';
    overallCondition: 'excellent' | 'good' | 'fair' | 'poor';
    notes?: string;
    partsStatus: IMaintenancePartRecord[];
    images?: string[];
    adminVerified: boolean;
    adminVerifiedBy?: string;
    adminVerifiedAt?: Date;
    adminNotes?: string;
    nextScheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMaintenancePartRecord {
    _id?: string;
    partId: string;
    partName: string;
    replaced: boolean;
    replacementPartId?: string;
    replacementNotes?: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    timeSpent: number;
    checklistItems: IMaintenanceChecklistRecord[];
}
export interface IMaintenanceChecklistRecord {
    _id?: string;
    itemId: string;
    description: string;
    completed: boolean;
    status: 'completed' | 'failed' | 'skipped';
    notes?: string;
    images?: string[];
}
declare const MaintenanceRecord: mongoose.Model<IMaintenanceRecord, {}, {}, {}, mongoose.Document<unknown, {}, IMaintenanceRecord, {}> & IMaintenanceRecord & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default MaintenanceRecord;
//# sourceMappingURL=MaintenanceRecord.d.ts.map