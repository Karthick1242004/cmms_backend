import { Router } from 'express';
import { PartController } from '../controllers/partController';
import { 
  validateJWT, 
  requireAuth, 
  requireAccessLevel,
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';

const router = Router();

// Apply JWT validation to all routes
router.use(validateJWT);

// GET /api/parts - Get all parts with filtering
// All authenticated users can view parts (with department filtering)
router.get(
  '/',
  enforceDepartmentAccess,
  PartController.getAllParts
);

// POST /api/parts - Create new part
// Admins and managers can create parts
router.post(
  '/',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  PartController.createPart
);

// GET /api/parts/stats - Get parts statistics
// All authenticated users can view stats (with department filtering)
router.get(
  '/stats',
  enforceDepartmentAccess,
  PartController.getPartsStats
);

// GET /api/parts/sync - Sync parts from assets (admin only)
// Only super admins can sync parts
router.get(
  '/sync',
  requireAccessLevel(['super_admin']),
  PartController.syncPartsFromAssets
);

// GET /api/parts/:id - Get part by ID
// All authenticated users can view specific parts
router.get(
  '/:id',
  PartController.getPartById
);

// PUT /api/parts/:id - Update part
// Admins and managers can update parts
router.put(
  '/:id',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  PartController.updatePart
);

// DELETE /api/parts/:id - Delete part
// Only super admins can delete parts
router.delete(
  '/:id',
  requireAccessLevel(['super_admin']),
  PartController.deletePart
);

export default router;