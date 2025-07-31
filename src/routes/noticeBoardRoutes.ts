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
import { extractUserContext, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

// Apply user context middleware to all routes
router.use(extractUserContext);

// Public routes (all authenticated users can access)
router.get('/', validateGetNotices, getAllNoticeBoard);
router.get('/:id', getNoticeBoardById);

// Admin-only routes
router.post('/', requireRole(['admin']), validateCreateNotice, createNoticeBoard);
router.put('/:id', requireRole(['admin']), validateUpdateNotice, updateNoticeBoard);
router.delete('/:id', requireRole(['admin']), deleteNoticeBoard);
router.patch('/:id/publish', requireRole(['admin']), validatePublishNotice, togglePublishNotice);
router.get('/stats/overview', requireRole(['admin']), getNoticeBoardStats);

export default router;