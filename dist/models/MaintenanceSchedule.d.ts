import mongoose, { Document } from 'mongoose';
export interface IMaintenanceSchedule extends Document {
    _id: string;
    assetId: string;
    assetName: string;
    assetTag?: string;
    assetType: string;
    location: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'custom';
    customFrequencyDays?: number;
    startDate: Date;
    nextDueDate: Date;
    lastCompletedDate?: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimatedDuration: number;
    assignedTechnician?: string;
    status: 'active' | 'inactive' | 'completed' | 'overdue';
    createdBy: string;
    parts: IMaintenancePart[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IMaintenancePart {
    _id?: string;
    partId: string;
    partName: string;
    partSku: string;
    estimatedTime: number;
    requiresReplacement: boolean;
    replacementFrequency?: number;
    lastReplacementDate?: Date;
    checklistItems: IMaintenanceChecklistItem[];
}
export interface IMaintenanceChecklistItem {
    _id?: string;
    description: string;
    isRequired: boolean;
    notes?: string;
    status: 'pending' | 'completed' | 'failed' | 'skipped';
}
declare const MaintenanceSchedule: mongoose.Model<IMaintenanceSchedule, {}, {}, {}, mongoose.Document<unknown, {}, IMaintenanceSchedule, {}> & IMaintenanceSchedule & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default MaintenanceSchedule;
//# sourceMappingURL=MaintenanceSchedule.d.ts.map