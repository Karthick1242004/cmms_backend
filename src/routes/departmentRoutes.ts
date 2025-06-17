import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';
import {
  validateCreateDepartment,
  validateUpdateDepartment,
  validateDepartmentId,
  validateDepartmentQuery
} from '../middleware/departmentValidation';

const router = Router();

// GET /api/departments - Get all departments with optional filtering and pagination
router.get(
  '/',
  validateDepartmentQuery,
  DepartmentController.getAllDepartments
);

// GET /api/departments/stats - Get department statistics
router.get(
  '/stats',
  DepartmentController.getDepartmentStats
);

// GET /api/departments/:id - Get department by ID
router.get(
  '/:id',
  validateDepartmentId,
  DepartmentController.getDepartmentById
);

// POST /api/departments - Create new department
router.post(
  '/',
  validateCreateDepartment,
  DepartmentController.createDepartment
);

// PUT /api/departments/:id - Update department
router.put(
  '/:id',
  validateUpdateDepartment,
  DepartmentController.updateDepartment
);

// DELETE /api/departments/:id - Delete department
router.delete(
  '/:id',
  validateDepartmentId,
  DepartmentController.deleteDepartment
);

export default router; 