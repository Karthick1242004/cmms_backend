import { Router } from 'express';
import { MeetingMinutesController } from '../controllers/meetingMinutesController';
import {
  validateCreateMeetingMinutes,
  validateUpdateMeetingMinutes,
  validateMeetingMinutesId,
  validateMeetingMinutesQuery,
  validateUpdateActionItem,
  handleValidationErrors
} from '../middleware/meetingMinutesValidation';
import { extractUserContext } from '../middleware/authMiddleware';

const router = Router();

// GET /api/meeting-minutes - Get all meeting minutes with optional filtering and pagination
router.get(
  '/',
  extractUserContext,
  validateMeetingMinutesQuery,
  handleValidationErrors,
  MeetingMinutesController.getAllMeetingMinutes
);

// GET /api/meeting-minutes/stats - Get meeting minutes statistics
router.get(
  '/stats',
  extractUserContext,
  MeetingMinutesController.getMeetingMinutesStats
);

// GET /api/meeting-minutes/:id - Get meeting minutes by ID
router.get(
  '/:id',
  extractUserContext,
  validateMeetingMinutesId,
  handleValidationErrors,
  MeetingMinutesController.getMeetingMinutesById
);

// POST /api/meeting-minutes - Create new meeting minutes
router.post(
  '/',
  extractUserContext,
  validateCreateMeetingMinutes,
  handleValidationErrors,
  MeetingMinutesController.createMeetingMinutes
);

// PUT /api/meeting-minutes/:id - Update meeting minutes
router.put(
  '/:id',
  extractUserContext,
  validateMeetingMinutesId,
  validateUpdateMeetingMinutes,
  handleValidationErrors,
  MeetingMinutesController.updateMeetingMinutes
);

// DELETE /api/meeting-minutes/:id - Delete meeting minutes
router.delete(
  '/:id',
  extractUserContext,
  validateMeetingMinutesId,
  handleValidationErrors,
  MeetingMinutesController.deleteMeetingMinutes
);

// PATCH /api/meeting-minutes/:id/action-items - Update action item status
router.patch(
  '/:id/action-items',
  extractUserContext,
  validateMeetingMinutesId,
  validateUpdateActionItem,
  handleValidationErrors,
  MeetingMinutesController.updateActionItemStatus
);

export default router;