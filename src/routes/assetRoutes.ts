import { Router } from 'express';
import { AssetController } from '../controllers/assetController';
import { 
  validateJWT, 
  requireAuth, 
  requireRole, 
  requireAccessLevel,
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';

const router = Router();

// Apply JWT validation to all routes
router.use(validateJWT);

// GET /api/assets - Get all assets with optional filtering and pagination
// All authenticated users can view assets (with department filtering)
router.get(
  '/',
  enforceDepartmentAccess, // Automatically filters by department for non-super admins
  AssetController.getAllAssets
);

// GET /api/assets/stats - Get asset statistics
// All authenticated users can view stats (with department filtering)
router.get(
  '/stats',
  enforceDepartmentAccess,
  AssetController.getAssetStats
);

// POST /api/assets/bulk-import - Bulk import assets
// Only super admins and department admins can bulk import
router.post(
  '/bulk-import',
  requireAccessLevel(['super_admin', 'department_admin']),
  AssetController.bulkImportAssets
);

// GET /api/assets/:id - Get asset by ID
// All authenticated users can view specific assets (with access control in controller)
router.get(
  '/:id',
  AssetController.getAssetById
);

// POST /api/assets - Create new asset
// Admins and managers can create assets
router.post(
  '/',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  AssetController.createAsset
);

// PUT /api/assets/:id - Update asset
// Admins and managers can update assets
router.put(
  '/:id',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  AssetController.updateAsset
);

// DELETE /api/assets/:id - Delete asset
// Only super admins can delete assets
router.delete(
  '/:id',
  requireAccessLevel(['super_admin']),
  AssetController.deleteAsset
);

export default router; 