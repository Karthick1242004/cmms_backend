import mongoose, { Document } from 'mongoose';
export interface ISafetyInspectionRecord extends Document {
    _id: string;
    scheduleId: string;
    assetId: string;
    assetName: string;
    completedDate: Date;
    startTime: string;
    endTime: string;
    actualDuration: number;
    inspector: string;
    inspectorId: string;
    status: 'completed' | 'partially_completed' | 'failed' | 'in_progress';
    overallComplianceScore: number;
    complianceStatus: 'compliant' | 'non_compliant' | 'requires_attention';
    notes?: string;
    categoryResults: ISafetyChecklistCategoryRecord[];
    violations: ISafetyViolation[];
    images?: string[];
    adminVerified: boolean;
    adminVerifiedBy?: string;
    adminVerifiedAt?: Date;
    adminNotes?: string;
    correctiveActionsRequired: boolean;
    nextScheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISafetyChecklistCategoryRecord {
    categoryId: string;
    categoryName: string;
    checklistItems: ISafetyChecklistRecord[];
    categoryComplianceScore: number;
    weight: number;
    timeSpent: number;
}
export interface ISafetyChecklistRecord {
    itemId: string;
    description: string;
    safetyStandard?: string;
    completed: boolean;
    status: 'compliant' | 'non_compliant' | 'not_applicable' | 'requires_attention';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
    correctiveAction?: string;
    images?: string[];
}
export interface ISafetyViolation {
    _id?: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    safetyStandard?: string;
    location: string;
    correctiveAction: string;
    priority: 'immediate' | 'urgent' | 'moderate' | 'low';
    assignedTo?: string;
    dueDate?: Date;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    images?: string[];
}
declare const SafetyInspectionRecord: mongoose.Model<ISafetyInspectionRecord, {}, {}, {}, mongoose.Document<unknown, {}, ISafetyInspectionRecord, {}> & ISafetyInspectionRecord & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default SafetyInspectionRecord;
//# sourceMappingURL=SafetyInspectionRecord.d.ts.map