"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsByDepartment = exports.getDailyLogActivityStats = exports.updateDailyLogActivityStatus = exports.deleteDailyLogActivity = exports.updateDailyLogActivity = exports.createDailyLogActivity = exports.getDailyLogActivityById = exports.getAllDailyLogActivities = void 0;
const DailyLogActivity_1 = __importDefault(require("../models/DailyLogActivity"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Department_1 = __importDefault(require("../models/Department"));
const Asset_1 = __importDefault(require("../models/Asset"));
// Get all daily log activities with filtering and pagination
const getAllDailyLogActivities = async (req, res) => {
    try {
        const { page = '1', limit = '10', department, status, priority, startDate, endDate, search, attendedBy, assetId } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filters
        const filters = {};
        // Department-based access control
        const user = req.user;
        if (user && user.role !== 'admin') {
            filters.department = user.department;
        }
        else if (department) {
            filters.department = department;
        }
        if (status) {
            filters.status = status;
        }
        if (priority) {
            filters.priority = priority;
        }
        if (attendedBy) {
            filters.attendedBy = attendedBy;
        }
        if (assetId) {
            filters.assetId = assetId;
        }
        // Date range filter
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) {
                filters.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filters.date.$lte = new Date(endDate);
            }
        }
        // Search filter
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            filters.$or = [
                { area: searchRegex },
                { natureOfProblem: searchRegex },
                { commentsOrSolution: searchRegex },
                { assetName: searchRegex },
                { attendedByName: searchRegex }
            ];
        }
        // Execute query with pagination
        const [activities, totalCount] = await Promise.all([
            DailyLogActivity_1.default.find(filters)
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            DailyLogActivity_1.default.countDocuments(filters)
        ]);
        const totalPages = Math.ceil(totalCount / limitNum);
        res.status(200).json({
            success: true,
            data: {
                activities,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching daily log activities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch daily log activities',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllDailyLogActivities = getAllDailyLogActivities;
// Get daily log activity by ID
const getDailyLogActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const filters = { _id: id };
        // Department-based access control
        if (user && user.role !== 'admin') {
            filters.department = user.department;
        }
        const activity = await DailyLogActivity_1.default.findOne(filters);
        if (!activity) {
            res.status(404).json({
                success: false,
                message: 'Daily log activity not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: activity
        });
    }
    catch (error) {
        console.error('Error fetching daily log activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch daily log activity',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getDailyLogActivityById = getDailyLogActivityById;
// Create new daily log activity
const createDailyLogActivity = async (req, res) => {
    try {
        const activityData = req.body;
        const user = req.user;
        // Validate that the department exists
        const department = await Department_1.default.findOne({
            $or: [
                { _id: activityData.departmentId },
                { name: activityData.departmentName }
            ]
        });
        if (!department) {
            res.status(400).json({
                success: false,
                message: 'Invalid department specified'
            });
            return;
        }
        // Validate that the asset exists and belongs to the department
        const asset = await Asset_1.default.findOne({
            _id: activityData.assetId,
            department: department.name
        });
        if (!asset) {
            res.status(400).json({
                success: false,
                message: 'Invalid asset specified or asset does not belong to the selected department'
            });
            return;
        }
        // Validate that the employee exists
        const employee = await Employee_1.default.findOne({ _id: activityData.attendedBy });
        if (!employee) {
            res.status(400).json({
                success: false,
                message: 'Invalid employee specified for attended by'
            });
            return;
        }
        // Validate verifiedBy if provided
        if (activityData.verifiedBy) {
            const verifier = await Employee_1.default.findOne({ _id: activityData.verifiedBy });
            if (!verifier) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid employee specified for verified by'
                });
                return;
            }
        }
        // Department-based access control for creation
        if (user && user.role !== 'admin' && department.name !== user.department) {
            res.status(403).json({
                success: false,
                message: 'You can only create activities for your own department'
            });
            return;
        }
        // Prepare activity data
        const newActivityData = {
            ...activityData,
            departmentId: department._id.toString(),
            departmentName: department.name,
            assetId: asset._id.toString(),
            assetName: asset.assetName,
            attendedBy: employee._id.toString(),
            attendedByName: employee.name,
            createdBy: user?.id || 'system',
            createdByName: user?.name || 'System',
            date: activityData.date ? new Date(activityData.date) : new Date()
        };
        const activity = new DailyLogActivity_1.default(newActivityData);
        const savedActivity = await activity.save();
        res.status(201).json({
            success: true,
            message: 'Daily log activity created successfully',
            data: savedActivity
        });
    }
    catch (error) {
        console.error('Error creating daily log activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create daily log activity',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createDailyLogActivity = createDailyLogActivity;
// Update daily log activity
const updateDailyLogActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = req.user;
        // Find existing activity
        const existingActivity = await DailyLogActivity_1.default.findById(id);
        if (!existingActivity) {
            res.status(404).json({
                success: false,
                message: 'Daily log activity not found'
            });
            return;
        }
        // Department-based access control
        if (user && user.role !== 'admin' && existingActivity.departmentName !== user.department) {
            res.status(403).json({
                success: false,
                message: 'You can only update activities from your own department'
            });
            return;
        }
        // Validate department if being updated
        if (updates.departmentId || updates.departmentName) {
            const department = await Department_1.default.findOne({
                $or: [
                    { _id: updates.departmentId },
                    { name: updates.departmentName }
                ]
            });
            if (!department) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid department specified'
                });
                return;
            }
            updates.departmentId = department._id.toString();
            updates.departmentName = department.name;
        }
        // Validate asset if being updated
        if (updates.assetId) {
            const asset = await Asset_1.default.findOne({
                _id: updates.assetId,
                department: updates.departmentName || existingActivity.departmentName
            });
            if (!asset) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid asset specified or asset does not belong to the department'
                });
                return;
            }
            updates.assetName = asset.assetName;
        }
        // Validate attendedBy if being updated
        if (updates.attendedBy) {
            const employee = await Employee_1.default.findOne({ _id: updates.attendedBy });
            if (!employee) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid employee specified for attended by'
                });
                return;
            }
            updates.attendedByName = employee.name;
        }
        // Validate verifiedBy if being updated
        if (updates.verifiedBy) {
            const verifier = await Employee_1.default.findOne({ _id: updates.verifiedBy });
            if (!verifier) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid employee specified for verified by'
                });
                return;
            }
            updates.verifiedByName = verifier.name;
        }
        // Update date if provided
        if (updates.date) {
            updates.date = new Date(updates.date);
        }
        const updatedActivity = await DailyLogActivity_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: 'Daily log activity updated successfully',
            data: updatedActivity
        });
    }
    catch (error) {
        console.error('Error updating daily log activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update daily log activity',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateDailyLogActivity = updateDailyLogActivity;
// Delete daily log activity
const deleteDailyLogActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        // Find existing activity
        const existingActivity = await DailyLogActivity_1.default.findById(id);
        if (!existingActivity) {
            res.status(404).json({
                success: false,
                message: 'Daily log activity not found'
            });
            return;
        }
        // Department-based access control
        if (user && user.role !== 'admin' && existingActivity.departmentName !== user.department) {
            res.status(403).json({
                success: false,
                message: 'You can only delete activities from your own department'
            });
            return;
        }
        await DailyLogActivity_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Daily log activity deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting daily log activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete daily log activity',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteDailyLogActivity = deleteDailyLogActivity;
// Update activity status
const updateDailyLogActivityStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, verifiedBy, verifiedByName } = req.body;
        const user = req.user;
        // Find existing activity
        const existingActivity = await DailyLogActivity_1.default.findById(id);
        if (!existingActivity) {
            res.status(404).json({
                success: false,
                message: 'Daily log activity not found'
            });
            return;
        }
        // Department-based access control
        if (user && user.role !== 'admin' && existingActivity.departmentName !== user.department) {
            res.status(403).json({
                success: false,
                message: 'You can only update activities from your own department'
            });
            return;
        }
        const updateData = { status };
        // If status is verified, require verifiedBy
        if (status === 'verified') {
            if (!verifiedBy) {
                res.status(400).json({
                    success: false,
                    message: 'Verified by is required when marking activity as verified'
                });
                return;
            }
            // Validate verifier exists
            const verifier = await Employee_1.default.findOne({ _id: verifiedBy });
            if (!verifier) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid employee specified for verified by'
                });
                return;
            }
            updateData.verifiedBy = verifiedBy;
            updateData.verifiedByName = verifier.name;
        }
        const updatedActivity = await DailyLogActivity_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        res.status(200).json({
            success: true,
            message: 'Activity status updated successfully',
            data: updatedActivity
        });
    }
    catch (error) {
        console.error('Error updating activity status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update activity status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateDailyLogActivityStatus = updateDailyLogActivityStatus;
// Get daily log activity statistics
const getDailyLogActivityStats = async (req, res) => {
    try {
        const user = req.user;
        const { department, startDate, endDate } = req.query;
        // Build base filter for department access control
        const baseFilter = {};
        if (user && user.role !== 'admin') {
            baseFilter.department = user.department;
        }
        else if (department) {
            baseFilter.department = department;
        }
        // Add date range filter
        if (startDate || endDate) {
            baseFilter.date = {};
            if (startDate) {
                baseFilter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                baseFilter.date.$lte = new Date(endDate);
            }
        }
        // Execute aggregation queries
        const [totalActivities, statusStats, priorityStats, departmentStats, recentActivities, monthlyTrend] = await Promise.all([
            DailyLogActivity_1.default.countDocuments(baseFilter),
            DailyLogActivity_1.default.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            DailyLogActivity_1.default.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$priority', count: { $sum: 1 } } }
            ]),
            user?.role === 'admin' ? DailyLogActivity_1.default.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$departmentName', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]) : [],
            DailyLogActivity_1.default.find(baseFilter)
                .sort({ createdAt: -1 })
                .limit(5)
                .select('area natureOfProblem status priority createdAt')
                .lean(),
            DailyLogActivity_1.default.aggregate([
                {
                    $match: {
                        ...baseFilter,
                        date: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);
        // Format statistics
        const stats = {
            totalActivities,
            statusBreakdown: statusStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            priorityBreakdown: priorityStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            departmentBreakdown: departmentStats,
            recentActivities,
            monthlyTrend: monthlyTrend.map(item => ({
                month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                count: item.count
            }))
        };
        res.status(200).json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Error fetching daily log activity statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getDailyLogActivityStats = getDailyLogActivityStats;
// Get assets by department (helper endpoint)
const getAssetsByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        // Find department
        const department = await Department_1.default.findById(departmentId);
        if (!department) {
            res.status(404).json({
                success: false,
                message: 'Department not found'
            });
            return;
        }
        // Get assets for this department
        const assets = await Asset_1.default.find({
            department: department.name
        }).select('_id assetName category condition statusText').lean();
        res.status(200).json({
            success: true,
            data: assets
        });
    }
    catch (error) {
        console.error('Error fetching assets by department:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assets',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAssetsByDepartment = getAssetsByDepartment;
//# sourceMappingURL=dailyLogActivityController.js.map