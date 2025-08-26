import express from 'express';
import {
  getAllNoticeBoard,
  getNoticeBoardById,
  createNoticeBoard,
  updateNoticeBoard,
  deleteNoticeBoard,
  togglePublishNotice,
  getNoticeBoardStats
} from '../controllers/noticeBoardController';
import {
  validateCreateNotice,
  validateUpdateNotice,
  validatePublishNotice,
  validateGetNotices,
  validateMarkAsViewed
} from '../middleware/noticeBoardValidation';
import { 
  validateJWT, 
  requireAuth, 
  requireAccessLevel,
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';

const router = express.Router();

// Apply JWT validation to all routes
router.use(validateJWT);

// Public routes (all authenticated users can access)
router.get(
  '/',
  enforceDepartmentAccess,
  validateGetNotices,
  getAllNoticeBoard
);

router.get(
  '/:id',
  getNoticeBoardById
);

// Admin-only routes
router.post(
  '/',
  requireAuth({ 
    roles: ['admin'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  validateCreateNotice,
  createNoticeBoard
);

router.put(
  '/:id',
  requireAuth({ 
    roles: ['admin'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  validateUpdateNotice,
  updateNoticeBoard
);

router.delete(
  '/:id',
  requireAccessLevel(['super_admin']),
  deleteNoticeBoard
);

router.patch(
  '/:id/publish',
  requireAuth({ 
    roles: ['admin'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  validatePublishNotice,
  togglePublishNotice
);

router.get(
  '/stats/overview',
  requireAuth({ 
    roles: ['admin'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  getNoticeBoardStats
);

export default router;