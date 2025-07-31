"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetingMinutesController_1 = require("../controllers/meetingMinutesController");
const meetingMinutesValidation_1 = require("../middleware/meetingMinutesValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/meeting-minutes - Get all meeting minutes with optional filtering and pagination
router.get('/', authMiddleware_1.extractUserContext, meetingMinutesValidation_1.validateMeetingMinutesQuery, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.getAllMeetingMinutes);
// GET /api/meeting-minutes/stats - Get meeting minutes statistics
router.get('/stats', authMiddleware_1.extractUserContext, meetingMinutesController_1.MeetingMinutesController.getMeetingMinutesStats);
// GET /api/meeting-minutes/:id - Get meeting minutes by ID
router.get('/:id', authMiddleware_1.extractUserContext, meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.getMeetingMinutesById);
// POST /api/meeting-minutes - Create new meeting minutes
router.post('/', authMiddleware_1.extractUserContext, meetingMinutesValidation_1.validateCreateMeetingMinutes, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.createMeetingMinutes);
// PUT /api/meeting-minutes/:id - Update meeting minutes
router.put('/:id', authMiddleware_1.extractUserContext, meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.validateUpdateMeetingMinutes, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.updateMeetingMinutes);
// DELETE /api/meeting-minutes/:id - Delete meeting minutes
router.delete('/:id', authMiddleware_1.extractUserContext, meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.deleteMeetingMinutes);
// PATCH /api/meeting-minutes/:id/action-items - Update action item status
router.patch('/:id/action-items', authMiddleware_1.extractUserContext, meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.validateUpdateActionItem, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.updateActionItemStatus);
exports.default = router;
//# sourceMappingURL=meetingMinutesRoutes.js.map