import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
  validateEmployeeQuery
} from '../middleware/employeeValidation';

const router = Router();

// Redirect shift-details routes to unified employee controller
// This maintains backward compatibility while using the unified data model

// GET /api/shift-details - Get all shift details (redirected to employees)
router.get(
  '/',
  validateEmployeeQuery,
  EmployeeController.getEmployeesAsShiftDetails
);

// GET /api/shift-details/stats - Get shift detail statistics (redirected to employee stats)
router.get(
  '/stats',
  EmployeeController.getEmployeeStats
);

// GET /api/shift-details/:id - Get shift detail by employee ID (redirected to employee)
router.get(
  '/:id',
  validateEmployeeId,
  EmployeeController.getEmployeeById
);

// POST /api/shift-details - Create new shift detail (redirected to employee creation)
router.post(
  '/',
  validateCreateEmployee,
  EmployeeController.createEmployee
);

// PUT /api/shift-details/:id - Update shift detail (redirected to employee update)
router.put(
  '/:id',
  validateUpdateEmployee,
  EmployeeController.updateEmployee
);

// DELETE /api/shift-details/:id - Delete shift detail (redirected to employee deletion)
router.delete(
  '/:id',
  validateEmployeeId,
  EmployeeController.deleteEmployee
);

export default router; 