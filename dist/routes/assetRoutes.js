"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assetController_1 = require("../controllers/assetController");
const router = (0, express_1.Router)();
// GET /api/assets - Get all assets with optional filtering and pagination
router.get('/', assetController_1.AssetController.getAllAssets);
// GET /api/assets/stats - Get asset statistics
router.get('/stats', assetController_1.AssetController.getAssetStats);
// POST /api/assets/bulk-import - Bulk import assets
router.post('/bulk-import', assetController_1.AssetController.bulkImportAssets);
// GET /api/assets/:id - Get asset by ID
router.get('/:id', assetController_1.AssetController.getAssetById);
// POST /api/assets - Create new asset
router.post('/', assetController_1.AssetController.createAsset);
// PUT /api/assets/:id - Update asset
router.put('/:id', assetController_1.AssetController.updateAsset);
// DELETE /api/assets/:id - Delete asset
router.delete('/:id', assetController_1.AssetController.deleteAsset);
exports.default = router;
//# sourceMappingURL=assetRoutes.js.map