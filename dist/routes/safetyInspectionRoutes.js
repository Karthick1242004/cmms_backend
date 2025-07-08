"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const safetyInspectionController_1 = require("../controllers/safetyInspectionController");
const safetyInspectionValidation_1 = require("../middleware/safetyInspectionValidation");
const router = express_1.default.Router();
// Safety Inspection Schedule Routes
router.get('/schedules/stats', safetyInspectionController_1.getSafetyInspectionStats);
router.get('/schedules', safetyInspectionValidation_1.validateScheduleQuery, safetyInspectionController_1.getSafetyInspectionSchedules);
router.get('/schedules/:id', safetyInspectionValidation_1.validateIdParam, safetyInspectionController_1.getSafetyInspectionScheduleById);
router.post('/schedules', safetyInspectionValidation_1.validateCreateSafetyInspectionSchedule, safetyInspectionController_1.createSafetyInspectionSchedule);
router.put('/schedules/:id', safetyInspectionValidation_1.validateUpdateSafetyInspectionSchedule, safetyInspectionController_1.updateSafetyInspectionSchedule);
router.delete('/schedules/:id', safetyInspectionValidation_1.validateIdParam, safetyInspectionController_1.deleteSafetyInspectionSchedule);
// Safety Inspection Record Routes
router.get('/records', safetyInspectionValidation_1.validateRecordQuery, safetyInspectionController_1.getSafetyInspectionRecords);
router.post('/records', safetyInspectionValidation_1.validateCreateSafetyInspectionRecord, safetyInspectionController_1.createSafetyInspectionRecord);
router.put('/records/:id', safetyInspectionValidation_1.validateUpdateSafetyInspectionRecord, safetyInspectionController_1.updateSafetyInspectionRecord);
router.patch('/records/:id/verify', safetyInspectionValidation_1.validateVerifySafetyInspectionRecord, safetyInspectionController_1.verifySafetyInspectionRecord);
exports.default = router;
//# sourceMappingURL=safetyInspectionRoutes.js.map