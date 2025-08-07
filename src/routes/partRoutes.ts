import { Router } from 'express';
import { PartController } from '../controllers/partController';
import { extractUserContext } from '../middleware/authMiddleware';

const router = Router();

// GET /api/parts - Get all parts with filtering
router.get('/', extractUserContext, PartController.getAllParts);

// GET /api/parts/stats - Get parts statistics
router.get('/stats', extractUserContext, PartController.getPartsStats);

// GET /api/parts/sync - Sync parts from assets (admin only)
router.get('/sync', extractUserContext, PartController.syncPartsFromAssets);

// GET /api/parts/:id - Get part by ID
router.get('/:id', extractUserContext, PartController.getPartById);

export default router;