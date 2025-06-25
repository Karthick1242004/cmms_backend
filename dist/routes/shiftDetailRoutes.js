"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shiftDetailController_1 = require("../controllers/shiftDetailController");
const shiftDetailValidation_1 = require("../middleware/shiftDetailValidation");
const router = (0, express_1.Router)();
// GET /api/shift-details - Get all shift details with optional filtering and pagination
router.get('/', shiftDetailValidation_1.validateShiftDetailQuery, shiftDetailController_1.ShiftDetailController.getAllShiftDetails);
// GET /api/shift-details/stats - Get shift detail statistics
router.get('/stats', shiftDetailController_1.ShiftDetailController.getShiftDetailStats);
// GET /api/shift-details/:id - Get shift detail by employee ID
router.get('/:id', shiftDetailValidation_1.validateShiftDetailId, shiftDetailController_1.ShiftDetailController.getShiftDetailById);
// POST /api/shift-details - Create new shift detail
router.post('/', shiftDetailValidation_1.validateCreateShiftDetail, shiftDetailController_1.ShiftDetailController.createShiftDetail);
// PUT /api/shift-details/:id - Update shift detail
router.put('/:id', shiftDetailValidation_1.validateUpdateShiftDetail, shiftDetailController_1.ShiftDetailController.updateShiftDetail);
// DELETE /api/shift-details/:id - Delete shift detail
router.delete('/:id', shiftDetailValidation_1.validateShiftDetailId, shiftDetailController_1.ShiftDetailController.deleteShiftDetail);
exports.default = router;
//# sourceMappingURL=shiftDetailRoutes.js.map