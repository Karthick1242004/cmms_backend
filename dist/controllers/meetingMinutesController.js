"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingMinutesController = void 0;
const express_validator_1 = require("express-validator");
const MeetingMinutes_1 = __importDefault(require("../models/MeetingMinutes"));
class MeetingMinutesController {
    // Get all meeting minutes with department-based filtering
    static async getAllMeetingMinutes(req, res) {
        try {
            const { page = 1, limit = 10, search, department, status, sortBy = 'meetingDateTime', sortOrder = 'desc', dateFrom, dateTo, } = req.query;
            // Build query based on user role and department
            const query = {};
            // If user is not admin, only show their department's meeting minutes
            if (req.user?.role !== 'admin') {
                query.department = req.user?.department;
            }
            else if (department && department !== 'all') {
                // Admin can filter by specific department
                query.department = department;
            }
            // Status filter
            if (status && status !== 'all') {
                query.status = status;
            }
            // Date range filter
            if (dateFrom || dateTo) {
                query.meetingDateTime = {};
                if (dateFrom) {
                    query.meetingDateTime.$gte = new Date(dateFrom);
                }
                if (dateTo) {
                    query.meetingDateTime.$lte = new Date(dateTo);
                }
            }
            // Search functionality
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { purpose: { $regex: search, $options: 'i' } },
                    { minutes: { $regex: search, $options: 'i' } },
                    { createdByName: { $regex: search, $options: 'i' } },
                    { 'attendees': { $regex: search, $options: 'i' } },
                    { 'tags': { $regex: search, $options: 'i' } },
                ];
            }
            // Calculate pagination
            const skip = (Number(page) - 1) * Number(limit);
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            // Execute query with pagination
            const [meetingMinutes, totalCount] = await Promise.all([
                MeetingMinutes_1.default.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                MeetingMinutes_1.default.countDocuments(query)
            ]);
            // Transform for frontend compatibility
            const transformedMeetingMinutes = meetingMinutes.map(mom => ({
                id: mom._id.toString(),
                title: mom.title,
                department: mom.department,
                meetingDateTime: mom.meetingDateTime,
                purpose: mom.purpose,
                minutes: mom.minutes,
                createdBy: mom.createdBy,
                createdByName: mom.createdByName,
                attendees: mom.attendees,
                status: mom.status,
                tags: mom.tags,
                location: mom.location,
                duration: mom.duration,
                actionItems: mom.actionItems,
                attachments: mom.attachments,
                createdAt: mom.createdAt,
                updatedAt: mom.updatedAt,
                canEdit: req.user?.role === 'admin' || mom.createdBy === req.user?.id,
                canDelete: req.user?.role === 'admin' || mom.createdBy === req.user?.id,
            }));
            // Calculate pagination info
            const totalPages = Math.ceil(totalCount / Number(limit));
            const hasNext = Number(page) < totalPages;
            const hasPrevious = Number(page) > 1;
            res.status(200).json({
                success: true,
                data: {
                    meetingMinutes: transformedMeetingMinutes,
                    pagination: {
                        currentPage: Number(page),
                        totalPages,
                        totalCount,
                        hasNext,
                        hasPrevious,
                    },
                },
                message: 'Meeting minutes retrieved successfully',
            });
        }
        catch (error) {
            console.error('Error fetching meeting minutes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching meeting minutes',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
    // Get meeting minutes by ID
    static async getMeetingMinutesById(req, res) {
        try {
            const { id } = req.params;
            const meetingMinutes = await MeetingMinutes_1.default.findById(id).lean();
            if (!meetingMinutes) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting minutes not found',
                });
                return;
            }
            // Check if user has access to this meeting minutes
            if (req.user?.role !== 'admin' && meetingMinutes.department !== req.user?.department) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied - Meeting minutes belongs to different department',
                });
                return;
            }
            // Transform for frontend
            const transformedMeetingMinutes = {
                id: meetingMinutes._id.toString(),
                title: meetingMinutes.title,
                department: meetingMinutes.department,
                meetingDateTime: meetingMinutes.meetingDateTime,
                purpose: meetingMinutes.purpose,
                minutes: meetingMinutes.minutes,
                createdBy: meetingMinutes.createdBy,
                createdByName: meetingMinutes.createdByName,
                attendees: meetingMinutes.attendees,
                status: meetingMinutes.status,
                tags: meetingMinutes.tags,
                location: meetingMinutes.location,
                duration: meetingMinutes.duration,
                actionItems: meetingMinutes.actionItems,
                attachments: meetingMinutes.attachments,
                createdAt: meetingMinutes.createdAt,
                updatedAt: meetingMinutes.updatedAt,
                canEdit: req.user?.role === 'admin' || meetingMinutes.createdBy === req.user?.id,
                canDelete: req.user?.role === 'admin' || meetingMinutes.createdBy === req.user?.id,
            };
            res.status(200).json({
                success: true,
                data: transformedMeetingMinutes,
                message: 'Meeting minutes retrieved successfully',
            });
        }
        catch (error) {
            console.error('Error fetching meeting minutes by ID:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching meeting minutes',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
    // Create new meeting minutes
    static async createMeetingMinutes(req, res) {
        try {
            // Check validation errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
                return;
            }
            const { title, department, meetingDateTime, purpose, minutes, attendees = [], status = 'published', tags = [], location, duration, actionItems = [], attachments = [], } = req.body;
            // For non-admin users, ensure they can only create for their department
            let finalDepartment = department;
            if (req.user?.role !== 'admin') {
                finalDepartment = req.user?.department;
            }
            // Create new meeting minutes
            const newMeetingMinutes = new MeetingMinutes_1.default({
                title,
                department: finalDepartment,
                meetingDateTime: new Date(meetingDateTime),
                purpose,
                minutes,
                createdBy: req.user?.id || 'unknown',
                createdByName: req.user?.name || 'Unknown User',
                attendees,
                status,
                tags,
                location,
                duration,
                actionItems,
                attachments,
            });
            const savedMeetingMinutes = await newMeetingMinutes.save();
            // Transform for frontend
            const transformedMeetingMinutes = {
                id: savedMeetingMinutes._id.toString(),
                title: savedMeetingMinutes.title,
                department: savedMeetingMinutes.department,
                meetingDateTime: savedMeetingMinutes.meetingDateTime,
                purpose: savedMeetingMinutes.purpose,
                minutes: savedMeetingMinutes.minutes,
                createdBy: savedMeetingMinutes.createdBy,
                createdByName: savedMeetingMinutes.createdByName,
                attendees: savedMeetingMinutes.attendees,
                status: savedMeetingMinutes.status,
                tags: savedMeetingMinutes.tags,
                location: savedMeetingMinutes.location,
                duration: savedMeetingMinutes.duration,
                actionItems: savedMeetingMinutes.actionItems,
                attachments: savedMeetingMinutes.attachments,
                createdAt: savedMeetingMinutes.createdAt,
                updatedAt: savedMeetingMinutes.updatedAt,
            };
            res.status(201).json({
                success: true,
                data: transformedMeetingMinutes,
                message: 'Meeting minutes created successfully',
            });
        }
        catch (error) {
            console.error('Error creating meeting minutes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating meeting minutes',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
    // Update meeting minutes
    static async updateMeetingMinutes(req, res) {
        try {
            const { id } = req.params;
            // Check validation errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
                return;
            }
            // Find existing meeting minutes
            const existingMeetingMinutes = await MeetingMinutes_1.default.findById(id);
            if (!existingMeetingMinutes) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting minutes not found',
                });
                return;
            }
            // Check permissions - only creator or admin can edit
            if (req.user?.role !== 'admin' && existingMeetingMinutes.createdBy !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied - You can only edit your own meeting minutes',
                });
                return;
            }
            // For non-admin users, prevent department changes
            const updateData = { ...req.body };
            if (req.user?.role !== 'admin' && updateData.department) {
                delete updateData.department;
            }
            // Update meeting minutes
            const updatedMeetingMinutes = await MeetingMinutes_1.default.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).lean();
            if (!updatedMeetingMinutes) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting minutes not found',
                });
                return;
            }
            // Transform for frontend
            const transformedMeetingMinutes = {
                id: updatedMeetingMinutes._id.toString(),
                title: updatedMeetingMinutes.title,
                department: updatedMeetingMinutes.department,
                meetingDateTime: updatedMeetingMinutes.meetingDateTime,
                purpose: updatedMeetingMinutes.purpose,
                minutes: updatedMeetingMinutes.minutes,
                createdBy: updatedMeetingMinutes.createdBy,
                createdByName: updatedMeetingMinutes.createdByName,
                attendees: updatedMeetingMinutes.attendees,
                status: updatedMeetingMinutes.status,
                tags: updatedMeetingMinutes.tags,
                location: updatedMeetingMinutes.location,
                duration: updatedMeetingMinutes.duration,
                actionItems: updatedMeetingMinutes.actionItems,
                attachments: updatedMeetingMinutes.attachments,
                createdAt: updatedMeetingMinutes.createdAt,
                updatedAt: updatedMeetingMinutes.updatedAt,
            };
            res.status(200).json({
                success: true,
                data: transformedMeetingMinutes,
                message: 'Meeting minutes updated successfully',
            });
        }
        catch (error) {
            console.error('Error updating meeting minutes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating meeting minutes',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
    // Delete meeting minutes
    static async deleteMeetingMinutes(req, res) {
        try {
            const { id } = req.params;
            // Find existing meeting minutes
            const existingMeetingMinutes = await MeetingMinutes_1.default.findById(id);
            if (!existingMeetingMinutes) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting minutes not found',
                });
                return;
            }
            // Check permissions - only creator or admin can delete
            if (req.user?.role !== 'admin' && existingMeetingMinutes.createdBy !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied - You can only delete your own meeting minutes',
                });
                return;
            }
            await MeetingMinutes_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: 'Meeting minutes deleted successfully',
            });
        }
        catch (error) {
            console.error('Error deleting meeting minutes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting meeting minutes',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
    // Get meeting minutes statistics
    static async getMeetingMinutesStats(req, res) {
        try {
            // Build department filter based on user role
            const departmentFilter = {};
            if (req.user?.role !== 'admin') {
                departmentFilter.department = req.user?.department;
            }
            const [totalCount, publishedCount, draftCount, archivedCount, departmentBreakdown, recentMeetings, actionItemsStats,] = await Promise.all([
                MeetingMinutes_1.default.countDocuments(departmentFilter),
                MeetingMinutes_1.default.countDocuments({ ...departmentFilter, status: 'published' }),
                MeetingMinutes_1.default.countDocuments({ ...departmentFilter, status: 'draft' }),
                MeetingMinutes_1.default.countDocuments({ ...departmentFilter, status: 'archived' }),
                MeetingMinutes_1.default.aggregate([
                    { $match: departmentFilter },
                    { $group: { _id: '$department', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ]),
                MeetingMinutes_1.default.find(departmentFilter)
                    .sort({ meetingDateTime: -1 })
                    .limit(5)
                    .select('title department meetingDateTime createdByName')
                    .lean(),
                MeetingMinutes_1.default.aggregate([
                    { $match: departmentFilter },
                    { $unwind: { path: '$actionItems', preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: '$actionItems.status',
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            res.status(200).json({
                success: true,
                data: {
                    totalMeetingMinutes: totalCount,
                    publishedMeetingMinutes: publishedCount,
                    draftMeetingMinutes: draftCount,
                    archivedMeetingMinutes: archivedCount,
                    departmentBreakdown,
                    recentMeetings: recentMeetings.map(meeting => ({
                        id: meeting._id.toString(),
                        title: meeting.title,
                        department: meeting.department,
                        meetingDateTime: meeting.meetingDateTime,
                        createdByName: meeting.createdByName,
                    })),
                    actionItemsStats,
                },
                message: 'Meeting minutes statistics retrieved successfully',
            });
        }
        catch (error) {
            console.error('Error fetching meeting minutes statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching statistics',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
    // Update action item status
    static async updateActionItemStatus(req, res) {
        try {
            const { id } = req.params;
            const { actionItemId, status } = req.body;
            // Find the meeting minutes
            const meetingMinutes = await MeetingMinutes_1.default.findById(id);
            if (!meetingMinutes) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting minutes not found',
                });
                return;
            }
            // Check if user has access to this meeting minutes
            if (req.user?.role !== 'admin' && meetingMinutes.department !== req.user?.department) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied - Meeting minutes belongs to different department',
                });
                return;
            }
            // Find and update the action item
            const actionItemIndex = meetingMinutes.actionItems.findIndex((item) => item._id?.toString() === actionItemId);
            if (actionItemIndex === -1) {
                res.status(404).json({
                    success: false,
                    message: 'Action item not found',
                });
                return;
            }
            // Update the action item status
            const actionItem = meetingMinutes.actionItems[actionItemIndex];
            if (actionItem) {
                actionItem.status = status;
                await meetingMinutes.save();
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'Action item not found',
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Action item status updated successfully',
            });
        }
        catch (error) {
            console.error('Error updating action item status:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating action item',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
    }
}
exports.MeetingMinutesController = MeetingMinutesController;
//# sourceMappingURL=meetingMinutesController.js.map