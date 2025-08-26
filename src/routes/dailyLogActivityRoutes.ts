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
import { 
  validateJWT, 
  requireAuth, 
  requireAccessLevel,
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';

const router = express.Router();

// Apply JWT validation to all routes
router.use(validateJWT);

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