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
import { 
  validateJWT, 
  requireAuth, 
  requireAccessLevel,
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';

const router = Router();

// Apply JWT validation to all routes
router.use(validateJWT);

// GET /api/meeting-minutes - Get all meeting minutes with optional filtering and pagination
// All authenticated users can view meeting minutes (with department filtering)
router.get(
  '/',
  enforceDepartmentAccess,
  validateMeetingMinutesQuery,
  handleValidationErrors,
  MeetingMinutesController.getAllMeetingMinutes
);

// GET /api/meeting-minutes/stats - Get meeting minutes statistics
// All authenticated users can view stats (with department filtering)
router.get(
  '/stats',
  enforceDepartmentAccess,
  MeetingMinutesController.getMeetingMinutesStats
);

// GET /api/meeting-minutes/:id - Get meeting minutes by ID
// All authenticated users can view specific meeting minutes
router.get(
  '/:id',
  validateMeetingMinutesId,
  handleValidationErrors,
  MeetingMinutesController.getMeetingMinutesById
);

// POST /api/meeting-minutes - Create new meeting minutes
// Admins and managers can create meeting minutes
router.post(
  '/',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  validateCreateMeetingMinutes,
  handleValidationErrors,
  MeetingMinutesController.createMeetingMinutes
);

// PUT /api/meeting-minutes/:id - Update meeting minutes
// Admins and managers can update meeting minutes
router.put(
  '/:id',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  validateMeetingMinutesId,
  validateUpdateMeetingMinutes,
  handleValidationErrors,
  MeetingMinutesController.updateMeetingMinutes
);

// DELETE /api/meeting-minutes/:id - Delete meeting minutes
// Only super admins can delete meeting minutes
router.delete(
  '/:id',
  requireAccessLevel(['super_admin']),
  validateMeetingMinutesId,
  handleValidationErrors,
  MeetingMinutesController.deleteMeetingMinutes
);

// PATCH /api/meeting-minutes/:id/action-items - Update action item status
// Admins and managers can update action items
router.patch(
  '/:id/action-items',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  validateMeetingMinutesId,
  validateUpdateActionItem,
  handleValidationErrors,
  MeetingMinutesController.updateActionItemStatus
);

export default router;