"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const express_validator_1 = require("express-validator");
const Ticket_1 = __importDefault(require("../models/Ticket"));
class TicketController {
    // Get all tickets with department access control and filtering
    static async getAllTickets(req, res) {
        try {
            const { page = 1, limit = 10, search, status, priority, department, reportType, assignedUser, equipmentId, isOpenTicket, sortBy = 'loggedDateTime', sortOrder = 'desc' } = req.query;
            // Build query based on access control
            const query = {};
            // Department-based access control
            // For now, we'll add department filtering logic here
            // In a real app, you'd get user department from JWT token
            const userDepartment = req.headers['x-user-department'] || department;
            if (!isOpenTicket || isOpenTicket === 'false') {
                if (userDepartment && userDepartment !== 'all') {
                    query.$or = [
                        { department: userDepartment },
                        { assignedDepartments: { $in: [userDepartment] } },
                        { isOpenTicket: true }
                    ];
                }
            }
            else {
                query.isOpenTicket = true;
            }
            // Apply filters
            if (status && status !== 'all') {
                query.status = status;
            }
            if (priority && priority !== 'all') {
                query.priority = priority;
            }
            if (equipmentId) {
                query.equipmentId = equipmentId;
            }
            if (assignedUser) {
                query.assignedUsers = { $in: [assignedUser] };
            }
            if (reportType && reportType !== 'all') {
                query[`reportType.${reportType}`] = true;
            }
            if (search) {
                query.$or = [
                    { ticketId: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { loggedBy: { $regex: search, $options: 'i' } },
                    { equipmentId: { $regex: search, $options: 'i' } }
                ];
            }
            // Calculate pagination
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            // Execute query with pagination
            const [tickets, totalCount] = await Promise.all([
                Ticket_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                Ticket_1.default.countDocuments(query)
            ]);
            // Transform for frontend compatibility
            const transformedTickets = tickets.map(ticket => ({
                id: ticket._id.toString(),
                ...ticket,
                timeSinceLogged: (() => {
                    const now = new Date();
                    const diffMs = now.getTime() - new Date(ticket.loggedDateTime).getTime();
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffHours / 24);
                    if (diffDays > 0) {
                        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                    }
                    else if (diffHours > 0) {
                        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                    }
                    else {
                        const diffMinutes = Math.floor(diffMs / (1000 * 60));
                        return `${Math.max(1, diffMinutes)} minute${diffMinutes > 1 ? 's' : ''} ago`;
                    }
                })()
            }));
            res.status(200).json({
                success: true,
                data: {
                    tickets: transformedTickets,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalCount / Number(limit)),
                        totalCount,
                        hasNext: Number(page) * Number(limit) < totalCount,
                        hasPrevious: Number(page) > 1,
                    },
                },
                message: 'Tickets retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching tickets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching tickets',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Get ticket by ID with access control
    static async getTicketById(req, res) {
        try {
            const { id } = req.params;
            const userDepartment = req.headers['x-user-department'];
            const ticket = await Ticket_1.default.findById(id).lean();
            if (!ticket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            // Check access control
            const hasAccess = ticket.isOpenTicket ||
                ticket.department === userDepartment ||
                ticket.assignedDepartments.includes(userDepartment) ||
                !userDepartment; // For testing without auth
            if (!hasAccess) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied - You do not have permission to view this ticket'
                });
                return;
            }
            const transformedTicket = {
                id: ticket._id.toString(),
                ...ticket
            };
            res.status(200).json({
                success: true,
                data: transformedTicket,
                message: 'Ticket retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching ticket:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching ticket',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Create new ticket
    static async createTicket(req, res) {
        try {
            // Check validation errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const ticketData = req.body;
            // Add current user as logged by if not provided
            if (!ticketData.loggedBy) {
                ticketData.loggedBy = req.headers['x-user-name'] || 'System';
            }
            // Set default values
            if (!ticketData.loggedDateTime) {
                ticketData.loggedDateTime = new Date();
            }
            // Ensure at least one report type is selected
            const reportTypes = ['service', 'maintenance', 'incident', 'breakdown'];
            const hasReportType = reportTypes.some(type => ticketData.reportType?.[type]);
            if (!hasReportType) {
                res.status(400).json({
                    success: false,
                    message: 'At least one report type must be selected'
                });
                return;
            }
            // Handle department assignments
            if (ticketData.assignedDepartments && !Array.isArray(ticketData.assignedDepartments)) {
                ticketData.assignedDepartments = [ticketData.assignedDepartments];
            }
            if (ticketData.assignedUsers && !Array.isArray(ticketData.assignedUsers)) {
                ticketData.assignedUsers = [ticketData.assignedUsers];
            }
            // Create new ticket
            const ticket = new Ticket_1.default(ticketData);
            const savedTicket = await ticket.save();
            res.status(201).json({
                success: true,
                data: savedTicket.toJSON(),
                message: 'Ticket created successfully'
            });
        }
        catch (error) {
            console.error('Error creating ticket:', error);
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err) => {
                    if (err.kind === 'required') {
                        return `${err.path} is required`;
                    }
                    else if (err.kind === 'enum') {
                        return `${err.path} must be one of: ${err.properties.enumValues.join(', ')}`;
                    }
                    else if (err.kind === 'maxlength') {
                        return `${err.path} cannot exceed ${err.properties.maxlength} characters`;
                    }
                    else {
                        return `${err.path}: ${err.message}`;
                    }
                });
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating ticket',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Update ticket
    static async updateTicket(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const userDepartment = req.headers['x-user-department'];
            const userName = req.headers['x-user-name'] || 'System';
            // Check if ticket exists and user has access
            const existingTicket = await Ticket_1.default.findById(id);
            if (!existingTicket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            // Check access control
            const hasAccess = existingTicket.isOpenTicket ||
                existingTicket.department === userDepartment ||
                existingTicket.assignedDepartments.includes(userDepartment) ||
                existingTicket.assignedUsers.includes(userName) ||
                !userDepartment; // For testing without auth
            if (!hasAccess) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied - You do not have permission to update this ticket'
                });
                return;
            }
            // Add activity log entry for the update
            if (!updates.activityLog) {
                updates.activityLog = [...existingTicket.activityLog];
            }
            updates.activityLog.push({
                date: new Date(),
                loggedBy: userName,
                remarks: updates.remarks || 'Ticket updated',
                action: 'Updated'
            });
            // Update ticket
            const updatedTicket = await Ticket_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
            if (!updatedTicket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    id: updatedTicket._id.toString(),
                    ...updatedTicket
                },
                message: 'Ticket updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating ticket:', error);
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err) => {
                    return `${err.path}: ${err.message}`;
                });
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating ticket',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Update ticket status
    static async updateTicketStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, remarks } = req.body;
            const userName = req.headers['x-user-name'] || 'System';
            if (!status) {
                res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
                return;
            }
            const ticket = await Ticket_1.default.findById(id);
            if (!ticket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            // Add activity log entry
            ticket.activityLog.push({
                date: new Date(),
                loggedBy: userName,
                remarks: remarks || `Status changed to ${status}`,
                action: 'Status Change'
            });
            // Update status
            ticket.status = status;
            // Set close date if status is Closed
            if (status === 'Closed') {
                ticket.ticketCloseDate = new Date();
            }
            const updatedTicket = await ticket.save();
            res.status(200).json({
                success: true,
                data: updatedTicket.toJSON(),
                message: 'Ticket status updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating ticket status:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating ticket status',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Assign ticket to users/departments
    static async assignTicket(req, res) {
        try {
            const { id } = req.params;
            const { assignedUsers, assignedDepartments, remarks } = req.body;
            const userName = req.headers['x-user-name'] || 'System';
            const ticket = await Ticket_1.default.findById(id);
            if (!ticket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            // Update assignments
            if (assignedUsers) {
                ticket.assignedUsers = Array.isArray(assignedUsers) ? assignedUsers : [assignedUsers];
            }
            if (assignedDepartments) {
                ticket.assignedDepartments = Array.isArray(assignedDepartments) ? assignedDepartments : [assignedDepartments];
            }
            // Add activity log entry
            ticket.activityLog.push({
                date: new Date(),
                loggedBy: userName,
                remarks: remarks || 'Ticket assignment updated',
                action: 'Assigned'
            });
            const updatedTicket = await ticket.save();
            res.status(200).json({
                success: true,
                data: updatedTicket.toJSON(),
                message: 'Ticket assigned successfully'
            });
        }
        catch (error) {
            console.error('Error assigning ticket:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while assigning ticket',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Add activity log entry
    static async addActivityLog(req, res) {
        try {
            const { id } = req.params;
            const { remarks, duration, action = 'Comment' } = req.body;
            const userName = req.headers['x-user-name'] || 'System';
            if (!remarks) {
                res.status(400).json({
                    success: false,
                    message: 'Remarks are required'
                });
                return;
            }
            const ticket = await Ticket_1.default.findById(id);
            if (!ticket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            // Add activity log entry
            const logEntry = {
                date: new Date(),
                loggedBy: userName,
                remarks,
                action
            };
            if (duration) {
                logEntry.duration = Number(duration);
            }
            ticket.activityLog.push(logEntry);
            const updatedTicket = await ticket.save();
            res.status(200).json({
                success: true,
                data: updatedTicket.toJSON(),
                message: 'Activity log added successfully'
            });
        }
        catch (error) {
            console.error('Error adding activity log:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while adding activity log',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Get tickets by department
    static async getTicketsByDepartment(req, res) {
        try {
            const { department } = req.params;
            const { status, limit = 50 } = req.query;
            const query = {
                $or: [
                    { department },
                    { assignedDepartments: { $in: [department] } },
                    { isOpenTicket: true }
                ]
            };
            if (status && status !== 'all') {
                query.status = status;
            }
            const tickets = await Ticket_1.default.find(query)
                .sort({ loggedDateTime: -1 })
                .limit(Number(limit))
                .lean();
            const transformedTickets = tickets.map(ticket => ({
                id: ticket._id.toString(),
                ...ticket
            }));
            res.status(200).json({
                success: true,
                data: transformedTickets,
                message: 'Department tickets retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching department tickets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching department tickets',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Get tickets by asset
    static async getTicketsByAsset(req, res) {
        try {
            const { assetId } = req.params;
            const { status, limit = 50 } = req.query;
            const query = { equipmentId: assetId };
            if (status && status !== 'all') {
                query.status = status;
            }
            const tickets = await Ticket_1.default.find(query)
                .sort({ loggedDateTime: -1 })
                .limit(Number(limit))
                .lean();
            const transformedTickets = tickets.map(ticket => ({
                id: ticket._id.toString(),
                ...ticket
            }));
            res.status(200).json({
                success: true,
                data: transformedTickets,
                message: 'Asset tickets retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching asset tickets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching asset tickets',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Get my tickets (assigned to current user)
    static async getMyTickets(req, res) {
        try {
            const userName = req.headers['x-user-name'];
            const userDepartment = req.headers['x-user-department'];
            if (!userName) {
                res.status(400).json({
                    success: false,
                    message: 'User identification required'
                });
                return;
            }
            const query = {
                $or: [
                    { assignedUsers: { $in: [userName] } },
                    { loggedBy: userName },
                    { department: userDepartment }
                ]
            };
            const tickets = await Ticket_1.default.find(query)
                .sort({ loggedDateTime: -1 })
                .limit(100)
                .lean();
            const transformedTickets = tickets.map(ticket => ({
                id: ticket._id.toString(),
                ...ticket
            }));
            res.status(200).json({
                success: true,
                data: transformedTickets,
                message: 'My tickets retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching my tickets:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching my tickets',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Get ticket statistics
    static async getTicketStats(req, res) {
        try {
            const userDepartment = req.headers['x-user-department'];
            // Build base query for department access
            const baseQuery = {};
            if (userDepartment && userDepartment !== 'all') {
                baseQuery.$or = [
                    { department: userDepartment },
                    { assignedDepartments: { $in: [userDepartment] } },
                    { isOpenTicket: true }
                ];
            }
            // Get various statistics
            const [totalTickets, openTickets, inProgressTickets, resolvedTickets, closedTickets, highPriorityTickets, criticalPriorityTickets, ticketsByType, recentTickets] = await Promise.all([
                Ticket_1.default.countDocuments(baseQuery),
                Ticket_1.default.countDocuments({ ...baseQuery, status: 'Open' }),
                Ticket_1.default.countDocuments({ ...baseQuery, status: 'In Progress' }),
                Ticket_1.default.countDocuments({ ...baseQuery, status: 'Resolved' }),
                Ticket_1.default.countDocuments({ ...baseQuery, status: 'Closed' }),
                Ticket_1.default.countDocuments({ ...baseQuery, priority: 'High' }),
                Ticket_1.default.countDocuments({ ...baseQuery, priority: 'Critical' }),
                Ticket_1.default.aggregate([
                    { $match: baseQuery },
                    {
                        $group: {
                            _id: null,
                            service: { $sum: { $cond: ['$reportType.service', 1, 0] } },
                            maintenance: { $sum: { $cond: ['$reportType.maintenance', 1, 0] } },
                            incident: { $sum: { $cond: ['$reportType.incident', 1, 0] } },
                            breakdown: { $sum: { $cond: ['$reportType.breakdown', 1, 0] } }
                        }
                    }
                ]),
                Ticket_1.default.find(baseQuery)
                    .sort({ loggedDateTime: -1 })
                    .limit(5)
                    .select('ticketId subject status priority loggedDateTime')
                    .lean()
            ]);
            const stats = {
                total: totalTickets,
                byStatus: {
                    open: openTickets,
                    inProgress: inProgressTickets,
                    resolved: resolvedTickets,
                    closed: closedTickets
                },
                byPriority: {
                    high: highPriorityTickets,
                    critical: criticalPriorityTickets
                },
                byType: ticketsByType[0] || { service: 0, maintenance: 0, incident: 0, breakdown: 0 },
                recent: recentTickets.map(ticket => ({
                    id: ticket._id.toString(),
                    ...ticket
                }))
            };
            res.status(200).json({
                success: true,
                data: stats,
                message: 'Ticket statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching ticket stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching ticket statistics',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Delete ticket (soft delete by updating status)
    static async deleteTicket(req, res) {
        try {
            const { id } = req.params;
            const userName = req.headers['x-user-name'] || 'System';
            const ticket = await Ticket_1.default.findById(id);
            if (!ticket) {
                res.status(404).json({
                    success: false,
                    message: 'Ticket not found'
                });
                return;
            }
            // For now, we'll just close the ticket instead of deleting
            // In a real system, you might want to implement proper soft delete
            ticket.status = 'Closed';
            ticket.ticketCloseDate = new Date();
            // Add activity log entry
            ticket.activityLog.push({
                date: new Date(),
                loggedBy: userName,
                remarks: 'Ticket deleted/closed',
                action: 'Closed'
            });
            await ticket.save();
            res.status(200).json({
                success: true,
                message: 'Ticket deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting ticket:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting ticket',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}
exports.TicketController = TicketController;
//# sourceMappingURL=ticketController.js.map