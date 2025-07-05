import express from 'express';
import {
  getSafetyInspectionSchedules,
  getSafetyInspectionScheduleById,
  createSafetyInspectionSchedule,
  updateSafetyInspectionSchedule,
  deleteSafetyInspectionSchedule,
  getSafetyInspectionStats,
  getSafetyInspectionRecords,
  createSafetyInspectionRecord,
  updateSafetyInspectionRecord,
  verifySafetyInspectionRecord
} from '../controllers/safetyInspectionController';

import {
  validateCreateSafetyInspectionSchedule,
  validateUpdateSafetyInspectionSchedule,
  validateCreateSafetyInspectionRecord,
  validateUpdateSafetyInspectionRecord,
  validateVerifySafetyInspectionRecord,
  validateIdParam,
  validateScheduleQuery,
  validateRecordQuery
} from '../middleware/safetyInspectionValidation';

const router = express.Router();

// Safety Inspection Schedule Routes
router.get('/schedules/stats', getSafetyInspectionStats);
router.get('/schedules', validateScheduleQuery, getSafetyInspectionSchedules);
router.get('/schedules/:id', validateIdParam, getSafetyInspectionScheduleById);
router.post('/schedules', validateCreateSafetyInspectionSchedule, createSafetyInspectionSchedule);
router.put('/schedules/:id', validateUpdateSafetyInspectionSchedule, updateSafetyInspectionSchedule);
router.delete('/schedules/:id', validateIdParam, deleteSafetyInspectionSchedule);

// Safety Inspection Record Routes
router.get('/records', validateRecordQuery, getSafetyInspectionRecords);
router.post('/records', validateCreateSafetyInspectionRecord, createSafetyInspectionRecord);
router.put('/records/:id', validateUpdateSafetyInspectionRecord, updateSafetyInspectionRecord);
router.patch('/records/:id/verify', validateVerifySafetyInspectionRecord, verifySafetyInspectionRecord);

export default router; 