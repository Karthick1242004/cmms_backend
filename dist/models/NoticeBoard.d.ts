import mongoose, { Document } from 'mongoose';
export interface INoticeBoard extends Document {
    _id: string;
    title: string;
    content: string;
    type: 'text' | 'link' | 'file';
    linkUrl?: string;
    fileName?: string;
    fileType?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    targetAudience: 'all' | 'department' | 'role';
    targetDepartments?: string[];
    targetRoles?: string[];
    isActive: boolean;
    isPublished: boolean;
    publishedAt?: Date;
    expiresAt?: Date;
    viewCount: number;
    viewedBy: Array<{
        userId: string;
        userName: string;
        viewedAt: Date;
    }>;
    tags: string[];
    createdBy: string;
    createdByName: string;
    createdByRole: string;
    updatedBy?: string;
    updatedByName?: string;
    createdAt: Date;
    updatedAt: Date;
    isVisible?: boolean;
    isExpired?: boolean;
    canUserView(userDepartment: string, userRole: string): boolean;
    markAsViewed(userId: string, userName: string): Promise<INoticeBoard>;
}
declare const _default: mongoose.Model<INoticeBoard, {}, {}, {}, mongoose.Document<unknown, {}, INoticeBoard, {}> & INoticeBoard & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=NoticeBoard.d.ts.map