import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenanceController';
import {
  validateCreateSchedule,
  validateUpdateSchedule,
  validateCreateRecord,
  validateUpdateRecord,
  validateVerifyRecord,
  validateMaintenanceId,
  validateScheduleQuery,
  validateRecordQuery
} from '../middleware/maintenanceValidation';

const router = Router();

// ========== MAINTENANCE SCHEDULES ==========

// GET /api/maintenance/schedules - Get all maintenance schedules with optional filtering and pagination
router.get(
  '/schedules',
  validateScheduleQuery,
  MaintenanceController.getAllSchedules
);

// GET /api/maintenance/schedules/:id - Get maintenance schedule by ID
router.get(
  '/schedules/:id',
  validateMaintenanceId,
  MaintenanceController.getScheduleById
);

// POST /api/maintenance/schedules - Create new maintenance schedule
router.post(
  '/schedules',
  validateCreateSchedule,
  MaintenanceController.createSchedule
);

// PUT /api/maintenance/schedules/:id - Update maintenance schedule
router.put(
  '/schedules/:id',
  validateUpdateSchedule,
  MaintenanceController.updateSchedule
);

// DELETE /api/maintenance/schedules/:id - Delete maintenance schedule
router.delete(
  '/schedules/:id',
  validateMaintenanceId,
  MaintenanceController.deleteSchedule
);

// ========== MAINTENANCE RECORDS ==========

// GET /api/maintenance/records - Get all maintenance records with optional filtering and pagination
router.get(
  '/records',
  validateRecordQuery,
  MaintenanceController.getAllRecords
);

// GET /api/maintenance/records/:id - Get maintenance record by ID
router.get(
  '/records/:id',
  validateMaintenanceId,
  MaintenanceController.getRecordById
);

// POST /api/maintenance/records - Create new maintenance record
router.post(
  '/records',
  validateCreateRecord,
  MaintenanceController.createRecord
);

// PUT /api/maintenance/records/:id - Update maintenance record
router.put(
  '/records/:id',
  validateUpdateRecord,
  MaintenanceController.updateRecord
);

// PATCH /api/maintenance/records/:id/verify - Verify maintenance record (admin only)
router.patch(
  '/records/:id/verify',
  validateVerifyRecord,
  MaintenanceController.verifyRecord
);

// DELETE /api/maintenance/records/:id - Delete maintenance record
router.delete(
  '/records/:id',
  validateMaintenanceId,
  MaintenanceController.deleteRecord
);

// ========== STATISTICS ==========

// GET /api/maintenance/stats - Get maintenance statistics
router.get(
  '/stats',
  MaintenanceController.getMaintenanceStats
);

export default router; 