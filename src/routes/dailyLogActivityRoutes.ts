import express from 'express';
import {
  getAllDailyLogActivities,
  getDailyLogActivityById,
  createDailyLogActivity,
  updateDailyLogActivity,
  deleteDailyLogActivity,
  updateDailyLogActivityStatus,
  getDailyLogActivityStats,
  getAssetsByDepartment
} from '../controllers/dailyLogActivityController';
import {
  validateCreateDailyLogActivity,
  validateUpdateDailyLogActivity,
  validateGetDailyLogActivity,
  validateQueryDailyLogActivities,
  validateUpdateStatus
} from '../middleware/dailyLogActivityValidation';
import { extractUserContext } from '../middleware/authMiddleware';

const router = express.Router();

// Apply user context middleware to all routes
router.use(extractUserContext);

// Routes
router.get('/', validateQueryDailyLogActivities, getAllDailyLogActivities);
router.get('/stats', getDailyLogActivityStats);
router.get('/:id', validateGetDailyLogActivity, getDailyLogActivityById);
router.post('/', validateCreateDailyLogActivity, createDailyLogActivity);
router.put('/:id', validateUpdateDailyLogActivity, updateDailyLogActivity);
router.patch('/:id/status', validateUpdateStatus, updateDailyLogActivityStatus);
router.delete('/:id', validateGetDailyLogActivity, deleteDailyLogActivity);

// Helper routes
router.get('/assets/department/:departmentId', getAssetsByDepartment);

export default router;