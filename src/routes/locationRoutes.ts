import { Router } from 'express';
import { LocationController } from '../controllers/locationController';

const router = Router();

// GET /api/locations - Get all locations with optional filtering and pagination
router.get('/', LocationController.getAllLocations);

// GET /api/locations/stats - Get location statistics
router.get('/stats', LocationController.getLocationStats);

// GET /api/locations/:id - Get location by ID
router.get('/:id', LocationController.getLocationById);

// POST /api/locations - Create new location
router.post('/', LocationController.createLocation);

// PUT /api/locations/:id - Update location
router.put('/:id', LocationController.updateLocation);

// DELETE /api/locations/:id - Delete location
router.delete('/:id', LocationController.deleteLocation);

export default router; 