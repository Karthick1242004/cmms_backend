"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assetController_1 = require("../controllers/assetController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.validateJWT);
router.get('/', authMiddleware_1.enforceDepartmentAccess, assetController_1.AssetController.getAllAssets);
router.get('/stats', authMiddleware_1.enforceDepartmentAccess, assetController_1.AssetController.getAssetStats);
router.post('/bulk-import', (0, authMiddleware_1.requireAccessLevel)(['super_admin', 'department_admin']), assetController_1.AssetController.bulkImportAssets);
router.get('/:id', assetController_1.AssetController.getAssetById);
router.post('/', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), assetController_1.AssetController.createAsset);
router.put('/:id', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), assetController_1.AssetController.updateAsset);
router.delete('/:id', (0, authMiddleware_1.requireAccessLevel)(['super_admin']), assetController_1.AssetController.deleteAsset);
exports.default = router;
