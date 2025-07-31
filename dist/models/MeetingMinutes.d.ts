import mongoose, { Document } from 'mongoose';
export interface IMeetingMinutes extends Document {
    _id: string;
    title: string;
    department: string;
    meetingDateTime: Date;
    purpose: string;
    minutes: string;
    createdBy: string;
    createdByName: string;
    attendees: string[];
    status: 'draft' | 'published' | 'archived';
    tags: string[];
    location: string;
    duration: number;
    actionItems: {
        _id?: string;
        description: string;
        assignedTo: string;
        dueDate: Date;
        status: 'pending' | 'in-progress' | 'completed';
    }[];
    attachments: {
        filename: string;
        url: string;
        uploadedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
declare const MeetingMinutes: mongoose.Model<IMeetingMinutes, {}, {}, {}, mongoose.Document<unknown, {}, IMeetingMinutes, {}> & IMeetingMinutes & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default MeetingMinutes;
//# sourceMappingURL=MeetingMinutes.d.ts.map