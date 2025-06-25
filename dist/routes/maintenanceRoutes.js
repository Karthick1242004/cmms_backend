"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
const maintenanceValidation_1 = require("../middleware/maintenanceValidation");
const router = (0, express_1.Router)();
// ========== MAINTENANCE SCHEDULES ==========
// GET /api/maintenance/schedules - Get all maintenance schedules with optional filtering and pagination
router.get('/schedules', maintenanceValidation_1.validateScheduleQuery, maintenanceController_1.MaintenanceController.getAllSchedules);
// GET /api/maintenance/schedules/:id - Get maintenance schedule by ID
router.get('/schedules/:id', maintenanceValidation_1.validateMaintenanceId, maintenanceController_1.MaintenanceController.getScheduleById);
// POST /api/maintenance/schedules - Create new maintenance schedule
router.post('/schedules', maintenanceValidation_1.validateCreateSchedule, maintenanceController_1.MaintenanceController.createSchedule);
// PUT /api/maintenance/schedules/:id - Update maintenance schedule
router.put('/schedules/:id', maintenanceValidation_1.validateUpdateSchedule, maintenanceController_1.MaintenanceController.updateSchedule);
// DELETE /api/maintenance/schedules/:id - Delete maintenance schedule
router.delete('/schedules/:id', maintenanceValidation_1.validateMaintenanceId, maintenanceController_1.MaintenanceController.deleteSchedule);
// ========== MAINTENANCE RECORDS ==========
// GET /api/maintenance/records - Get all maintenance records with optional filtering and pagination
router.get('/records', maintenanceValidation_1.validateRecordQuery, maintenanceController_1.MaintenanceController.getAllRecords);
// GET /api/maintenance/records/:id - Get maintenance record by ID
router.get('/records/:id', maintenanceValidation_1.validateMaintenanceId, maintenanceController_1.MaintenanceController.getRecordById);
// POST /api/maintenance/records - Create new maintenance record
router.post('/records', maintenanceValidation_1.validateCreateRecord, maintenanceController_1.MaintenanceController.createRecord);
// PUT /api/maintenance/records/:id - Update maintenance record
router.put('/records/:id', maintenanceValidation_1.validateUpdateRecord, maintenanceController_1.MaintenanceController.updateRecord);
// PATCH /api/maintenance/records/:id/verify - Verify maintenance record (admin only)
router.patch('/records/:id/verify', maintenanceValidation_1.validateVerifyRecord, maintenanceController_1.MaintenanceController.verifyRecord);
// DELETE /api/maintenance/records/:id - Delete maintenance record
router.delete('/records/:id', maintenanceValidation_1.validateMaintenanceId, maintenanceController_1.MaintenanceController.deleteRecord);
// ========== STATISTICS ==========
// GET /api/maintenance/stats - Get maintenance statistics
router.get('/stats', maintenanceController_1.MaintenanceController.getMaintenanceStats);
exports.default = router;
//# sourceMappingURL=maintenanceRoutes.js.map