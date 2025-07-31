"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNoticeBoardStats = exports.togglePublishNotice = exports.deleteNoticeBoard = exports.updateNoticeBoard = exports.createNoticeBoard = exports.getNoticeBoardById = exports.getAllNoticeBoard = void 0;
const NoticeBoard_1 = __importDefault(require("../models/NoticeBoard"));
const Department_1 = __importDefault(require("../models/Department"));
// Get all notice board entries with filtering, pagination, and user-specific visibility
const getAllNoticeBoard = async (req, res) => {
    try {
        const { page = 1, limit = 10, priority, type, targetAudience, isActive, isPublished, search, tags } = req.query;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const userId = req.user.id;
        const userDepartment = req.user.department;
        const userRole = req.user.role;
        // Build query for visible notices
        const query = {
            isActive: true,
            isPublished: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        };
        // Apply user-specific visibility filters
        const visibilityConditions = [
            { targetAudience: 'all' },
            { targetAudience: 'department', targetDepartments: userDepartment },
            { targetAudience: 'role', targetRoles: userRole }
        ];
        query.$and = [
            { $or: visibilityConditions }
        ];
        // Apply additional filters if provided (admin-only filters)
        if (userRole === 'admin') {
            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }
            if (isPublished !== undefined) {
                query.isPublished = isPublished === 'true';
            }
            if (targetAudience) {
                query.targetAudience = targetAudience;
            }
        }
        // Apply common filters
        if (priority) {
            query.priority = priority;
        }
        if (type) {
            query.type = type;
        }
        // Search functionality
        if (search) {
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            });
        }
        // Tag filtering
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            query.tags = { $in: tagArray };
        }
        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Execute query with pagination
        const [notices, totalCount] = await Promise.all([
            NoticeBoard_1.default.find(query)
                .sort({ priority: -1, publishedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .select('-viewedBy') // Exclude viewedBy array from list view for performance
                .lean(),
            NoticeBoard_1.default.countDocuments(query)
        ]);
        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasNext = pageNum < totalPages;
        const hasPrevious = pageNum > 1;
        res.status(200).json({
            success: true,
            data: {
                notices,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    hasNext,
                    hasPrevious
                }
            },
            message: 'Notice board entries retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching notice board entries:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching notice board entries',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.getAllNoticeBoard = getAllNoticeBoard;
// Get single notice board entry by ID
const getNoticeBoardById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const { id: userId, name: userName, department: userDepartment, role: userRole } = req.user;
        const notice = await NoticeBoard_1.default.findById(id);
        if (!notice) {
            res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
            return;
        }
        // Check if user can view this notice
        const canView = notice.canUserView(userDepartment, userRole) || userRole === 'admin';
        if (!canView) {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to view this notice'
            });
            return;
        }
        // Mark as viewed if user is not admin and hasn't viewed before
        if (userRole !== 'admin' && userId && userName) {
            await notice.markAsViewed(userId, userName);
        }
        res.status(200).json({
            success: true,
            data: notice,
            message: 'Notice retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching notice by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching notice',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.getNoticeBoardById = getNoticeBoardById;
// Create new notice board entry (admin only)
const createNoticeBoard = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const { id: userId, name: userName, role: userRole } = req.user;
        // Check if user is admin
        if (userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Only administrators can create notices'
            });
            return;
        }
        const { title, content, type = 'text', linkUrl, fileName, fileType, priority = 'medium', targetAudience = 'all', targetDepartments = [], targetRoles = [], expiresAt, tags = [], isPublished = false } = req.body;
        // Validate target departments exist
        if (targetAudience === 'department' && targetDepartments.length > 0) {
            const existingDepts = await Department_1.default.find({
                _id: { $in: targetDepartments }
            }).select('_id');
            if (existingDepts.length !== targetDepartments.length) {
                res.status(400).json({
                    success: false,
                    message: 'One or more target departments do not exist'
                });
                return;
            }
        }
        // Create notice
        const noticeData = {
            title,
            content,
            type,
            linkUrl,
            fileName,
            fileType,
            priority,
            targetAudience,
            targetDepartments: targetAudience === 'department' ? targetDepartments : [],
            targetRoles: targetAudience === 'role' ? targetRoles : [],
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            tags,
            isPublished,
            publishedAt: isPublished ? new Date() : undefined,
            createdBy: userId,
            createdByName: userName,
            createdByRole: userRole
        };
        const notice = new NoticeBoard_1.default(noticeData);
        await notice.save();
        res.status(201).json({
            success: true,
            data: notice,
            message: 'Notice created successfully'
        });
    }
    catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating notice',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.createNoticeBoard = createNoticeBoard;
// Update notice board entry (admin only)
const updateNoticeBoard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const { id: userId, name: userName, role: userRole } = req.user;
        // Check if user is admin
        if (userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Only administrators can update notices'
            });
            return;
        }
        const notice = await NoticeBoard_1.default.findById(id);
        if (!notice) {
            res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
            return;
        }
        const { title, content, type, linkUrl, fileName, fileType, priority, targetAudience, targetDepartments, targetRoles, expiresAt, tags, isActive, isPublished } = req.body;
        // Validate target departments if provided
        if (targetAudience === 'department' && targetDepartments?.length > 0) {
            const existingDepts = await Department_1.default.find({
                _id: { $in: targetDepartments }
            }).select('_id');
            if (existingDepts.length !== targetDepartments.length) {
                res.status(400).json({
                    success: false,
                    message: 'One or more target departments do not exist'
                });
                return;
            }
        }
        // Update fields
        if (title !== undefined)
            notice.title = title;
        if (content !== undefined)
            notice.content = content;
        if (type !== undefined)
            notice.type = type;
        if (linkUrl !== undefined)
            notice.linkUrl = linkUrl;
        if (fileName !== undefined)
            notice.fileName = fileName;
        if (fileType !== undefined)
            notice.fileType = fileType;
        if (priority !== undefined)
            notice.priority = priority;
        if (targetAudience !== undefined) {
            notice.targetAudience = targetAudience;
            notice.targetDepartments = targetAudience === 'department' ? (targetDepartments || []) : [];
            notice.targetRoles = targetAudience === 'role' ? (targetRoles || []) : [];
        }
        if (expiresAt !== undefined) {
            if (expiresAt) {
                notice.expiresAt = new Date(expiresAt);
            }
            else {
                notice.expiresAt = undefined;
            }
        }
        if (tags !== undefined)
            notice.tags = tags;
        if (isActive !== undefined)
            notice.isActive = isActive;
        if (isPublished !== undefined) {
            notice.isPublished = isPublished;
            if (isPublished && !notice.publishedAt) {
                notice.publishedAt = new Date();
            }
        }
        notice.updatedBy = userId;
        notice.updatedByName = userName;
        await notice.save();
        res.status(200).json({
            success: true,
            data: notice,
            message: 'Notice updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating notice:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating notice',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.updateNoticeBoard = updateNoticeBoard;
// Delete notice board entry (admin only)
const deleteNoticeBoard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const { role: userRole } = req.user;
        // Check if user is admin
        if (userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Only administrators can delete notices'
            });
            return;
        }
        const notice = await NoticeBoard_1.default.findById(id);
        if (!notice) {
            res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
            return;
        }
        await NoticeBoard_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Notice deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting notice',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.deleteNoticeBoard = deleteNoticeBoard;
// Publish/unpublish notice (admin only)
const togglePublishNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const { id: userId, name: userName, role: userRole } = req.user;
        // Check if user is admin
        if (userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Only administrators can publish/unpublish notices'
            });
            return;
        }
        const notice = await NoticeBoard_1.default.findById(id);
        if (!notice) {
            res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
            return;
        }
        notice.isPublished = isPublished;
        if (isPublished && !notice.publishedAt) {
            notice.publishedAt = new Date();
        }
        notice.updatedBy = userId;
        notice.updatedByName = userName;
        await notice.save();
        res.status(200).json({
            success: true,
            data: notice,
            message: `Notice ${isPublished ? 'published' : 'unpublished'} successfully`
        });
    }
    catch (error) {
        console.error('Error toggling notice publication:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating notice publication status',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.togglePublishNotice = togglePublishNotice;
// Get notice board statistics (admin only)
const getNoticeBoardStats = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const { role: userRole } = req.user;
        // Check if user is admin
        if (userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Only administrators can view notice board statistics'
            });
            return;
        }
        const [totalNotices, publishedNotices, activeNotices, expiredNotices, priorityStats, typeStats, recentNotices] = await Promise.all([
            NoticeBoard_1.default.countDocuments(),
            NoticeBoard_1.default.countDocuments({ isPublished: true }),
            NoticeBoard_1.default.countDocuments({ isActive: true }),
            NoticeBoard_1.default.countDocuments({
                expiresAt: { $exists: true, $lt: new Date() }
            }),
            NoticeBoard_1.default.aggregate([
                { $group: { _id: '$priority', count: { $sum: 1 } } }
            ]),
            NoticeBoard_1.default.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]),
            NoticeBoard_1.default.find({ isPublished: true, isActive: true })
                .sort({ publishedAt: -1 })
                .limit(5)
                .select('title priority publishedAt viewCount')
        ]);
        // Calculate average view count
        const viewStats = await NoticeBoard_1.default.aggregate([
            { $match: { isPublished: true } },
            { $group: {
                    _id: null,
                    avgViews: { $avg: '$viewCount' },
                    totalViews: { $sum: '$viewCount' }
                } }
        ]);
        const stats = {
            totalNotices,
            publishedNotices,
            activeNotices,
            expiredNotices,
            draftNotices: totalNotices - publishedNotices,
            totalViews: viewStats[0]?.totalViews || 0,
            averageViews: Math.round(viewStats[0]?.avgViews || 0),
            priorityBreakdown: priorityStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            typeBreakdown: typeStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            recentNotices
        };
        res.status(200).json({
            success: true,
            data: stats,
            message: 'Notice board statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching notice board statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching statistics',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.getNoticeBoardStats = getNoticeBoardStats;
//# sourceMappingURL=noticeBoardController.js.map