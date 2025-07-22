import mongoose, { Document } from 'mongoose';
export interface ITicket extends Document {
    _id: string;
    ticketId: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    loggedDateTime: Date;
    loggedBy: string;
    reportedVia: 'Phone' | 'Email' | 'In-Person' | 'Mobile App' | 'Web Portal';
    company: string;
    department: string;
    area: string;
    inCharge: string;
    equipmentId?: string;
    reviewedBy?: string;
    status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
    ticketCloseDate?: Date;
    totalTime?: number;
    reportType: {
        service: boolean;
        maintenance: boolean;
        incident: boolean;
        breakdown: boolean;
    };
    subject: string;
    description: string;
    solution?: string;
    isOpenTicket: boolean;
    assignedDepartments: string[];
    assignedUsers: string[];
    activityLog: {
        date: Date;
        duration?: number;
        loggedBy: string;
        remarks: string;
        action: 'Created' | 'Updated' | 'Assigned' | 'Comment' | 'Status Change' | 'Closed';
    }[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Ticket: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket, {}> & ITicket & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Ticket;
//# sourceMappingURL=Ticket.d.ts.map