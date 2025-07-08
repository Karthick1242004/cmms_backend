import mongoose, { Document } from 'mongoose';
export interface ISafetyInspectionSchedule extends Document {
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
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    estimatedDuration: number;
    assignedInspector?: string;
    safetyStandards: string[];
    status: 'active' | 'inactive' | 'completed' | 'overdue';
    createdBy: string;
    checklistCategories: ISafetyChecklistCategory[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ISafetyChecklistCategory {
    _id?: string;
    categoryName: string;
    description?: string;
    required: boolean;
    weight: number;
    checklistItems: ISafetyChecklistItem[];
}
export interface ISafetyChecklistItem {
    _id?: string;
    description: string;
    safetyStandard?: string;
    isRequired: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
    status: 'pending' | 'compliant' | 'non_compliant' | 'not_applicable' | 'requires_attention';
}
declare const SafetyInspectionSchedule: mongoose.Model<ISafetyInspectionSchedule, {}, {}, {}, mongoose.Document<unknown, {}, ISafetyInspectionSchedule, {}> & ISafetyInspectionSchedule & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default SafetyInspectionSchedule;
//# sourceMappingURL=SafetyInspectionSchedule.d.ts.map