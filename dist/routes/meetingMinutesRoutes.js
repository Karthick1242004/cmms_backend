"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetingMinutesController_1 = require("../controllers/meetingMinutesController");
const meetingMinutesValidation_1 = require("../middleware/meetingMinutesValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.validateJWT);
router.get('/', authMiddleware_1.enforceDepartmentAccess, meetingMinutesValidation_1.validateMeetingMinutesQuery, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.getAllMeetingMinutes);
router.get('/stats', authMiddleware_1.enforceDepartmentAccess, meetingMinutesController_1.MeetingMinutesController.getMeetingMinutesStats);
router.get('/:id', meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.getMeetingMinutesById);
router.post('/', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), meetingMinutesValidation_1.validateCreateMeetingMinutes, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.createMeetingMinutes);
router.put('/:id', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.validateUpdateMeetingMinutes, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.updateMeetingMinutes);
router.delete('/:id', (0, authMiddleware_1.requireAccessLevel)(['super_admin']), meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.deleteMeetingMinutes);
router.patch('/:id/action-items', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), meetingMinutesValidation_1.validateMeetingMinutesId, meetingMinutesValidation_1.validateUpdateActionItem, meetingMinutesValidation_1.handleValidationErrors, meetingMinutesController_1.MeetingMinutesController.updateActionItemStatus);
exports.default = router;
