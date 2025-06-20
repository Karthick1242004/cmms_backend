import { Router } from 'express';
import { ShiftDetailController } from '../controllers/shiftDetailController';
import {
  validateCreateShiftDetail,
  validateUpdateShiftDetail,
  validateShiftDetailId,
  validateShiftDetailQuery
} from '../middleware/shiftDetailValidation';

const router = Router();

// GET /api/shift-details - Get all shift details with optional filtering and pagination
router.get(
  '/',
  validateShiftDetailQuery,
  ShiftDetailController.getAllShiftDetails
);

// GET /api/shift-details/stats - Get shift detail statistics
router.get(
  '/stats',
  ShiftDetailController.getShiftDetailStats
);

// GET /api/shift-details/:id - Get shift detail by employee ID
router.get(
  '/:id',
  validateShiftDetailId,
  ShiftDetailController.getShiftDetailById
);

// POST /api/shift-details - Create new shift detail
router.post(
  '/',
  validateCreateShiftDetail,
  ShiftDetailController.createShiftDetail
);

// PUT /api/shift-details/:id - Update shift detail
router.put(
  '/:id',
  validateUpdateShiftDetail,
  ShiftDetailController.updateShiftDetail
);

// DELETE /api/shift-details/:id - Delete shift detail
router.delete(
  '/:id',
  validateShiftDetailId,
  ShiftDetailController.deleteShiftDetail
);

export default router; 