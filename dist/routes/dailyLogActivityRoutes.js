"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dailyLogActivityController_1 = require("../controllers/dailyLogActivityController");
const dailyLogActivityValidation_1 = require("../middleware/dailyLogActivityValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply user context middleware to all routes
router.use(authMiddleware_1.extractUserContext);
// Routes
router.get('/', dailyLogActivityValidation_1.validateQueryDailyLogActivities, dailyLogActivityController_1.getAllDailyLogActivities);
router.get('/stats', dailyLogActivityController_1.getDailyLogActivityStats);
router.get('/:id', dailyLogActivityValidation_1.validateGetDailyLogActivity, dailyLogActivityController_1.getDailyLogActivityById);
router.post('/', dailyLogActivityValidation_1.validateCreateDailyLogActivity, dailyLogActivityController_1.createDailyLogActivity);
router.put('/:id', dailyLogActivityValidation_1.validateUpdateDailyLogActivity, dailyLogActivityController_1.updateDailyLogActivity);
router.patch('/:id/status', dailyLogActivityValidation_1.validateUpdateStatus, dailyLogActivityController_1.updateDailyLogActivityStatus);
router.delete('/:id', dailyLogActivityValidation_1.validateGetDailyLogActivity, dailyLogActivityController_1.deleteDailyLogActivity);
// Helper routes
router.get('/assets/department/:departmentId', dailyLogActivityController_1.getAssetsByDepartment);
exports.default = router;
//# sourceMappingURL=dailyLogActivityRoutes.js.map