import { Router } from 'express';
import { AssetController } from '../controllers/assetController';

const router = Router();

// GET /api/assets - Get all assets with optional filtering and pagination
router.get(
  '/',
  AssetController.getAllAssets
);

// GET /api/assets/stats - Get asset statistics
router.get(
  '/stats',
  AssetController.getAssetStats
);

// POST /api/assets/bulk-import - Bulk import assets
router.post(
  '/bulk-import',
  AssetController.bulkImportAssets
);

// GET /api/assets/:id - Get asset by ID
router.get(
  '/:id',
  AssetController.getAssetById
);

// POST /api/assets - Create new asset
router.post(
  '/',
  AssetController.createAsset
);

// PUT /api/assets/:id - Update asset
router.put(
  '/:id',
  AssetController.updateAsset
);

// DELETE /api/assets/:id - Delete asset
router.delete(
  '/:id',
  AssetController.deleteAsset
);

export default router; 