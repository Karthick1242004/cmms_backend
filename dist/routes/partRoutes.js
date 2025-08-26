"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partController_1 = require("../controllers/partController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.validateJWT);
router.get('/', authMiddleware_1.enforceDepartmentAccess, partController_1.PartController.getAllParts);
router.post('/', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), partController_1.PartController.createPart);
router.get('/stats', authMiddleware_1.enforceDepartmentAccess, partController_1.PartController.getPartsStats);
router.get('/sync', (0, authMiddleware_1.requireAccessLevel)(['super_admin']), partController_1.PartController.syncPartsFromAssets);
router.get('/:id', partController_1.PartController.getPartById);
router.put('/:id', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), partController_1.PartController.updatePart);
router.delete('/:id', (0, authMiddleware_1.requireAccessLevel)(['super_admin']), partController_1.PartController.deletePart);
exports.default = router;
