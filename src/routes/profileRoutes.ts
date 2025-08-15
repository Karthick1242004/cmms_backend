import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { validateUpdateProfile } from '../middleware/profileValidation';

const router = Router();

// GET /api/profile - Get current user's profile
router.get(
  '/',
  ProfileController.getProfile
);

// PUT /api/profile - Update current user's profile
router.put(
  '/',
  validateUpdateProfile,
  ProfileController.updateProfile
);

// GET /api/profile/:employeeId - Get profile by employee ID (admin only)
router.get(
  '/:employeeId',
  ProfileController.getProfileByEmployeeId
);

export default router;

