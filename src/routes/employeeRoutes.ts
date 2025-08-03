import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
  validateEmployeeQuery
} from '../middleware/employeeValidation';

const router = Router();

// GET /api/employees - Get all employees with optional filtering and pagination
router.get(
  '/',
  validateEmployeeQuery,
  EmployeeController.getAllEmployees
);

// GET /api/employees/stats - Get employee statistics
router.get(
  '/stats',
  EmployeeController.getEmployeeStats
);

// GET /api/employees/:id/details - Get detailed employee information with work history and analytics
router.get(
  '/:id/details',
  validateEmployeeId,
  EmployeeController.getEmployeeDetails
);

// GET /api/employees/:id/analytics - Get employee analytics and performance metrics
router.get(
  '/:id/analytics',
  validateEmployeeId,
  EmployeeController.getEmployeeAnalytics
);

// GET /api/employees/:id/work-history - Get employee work history
router.get(
  '/:id/work-history',
  validateEmployeeId,
  EmployeeController.getEmployeeWorkHistory
);

// GET /api/employees/:id - Get employee by ID
router.get(
  '/:id',
  validateEmployeeId,
  EmployeeController.getEmployeeById
);

// POST /api/employees - Create new employee
router.post(
  '/',
  validateCreateEmployee,
  EmployeeController.createEmployee
);

// PUT /api/employees/:id - Update employee
router.put(
  '/:id',
  validateUpdateEmployee,
  EmployeeController.updateEmployee
);

// DELETE /api/employees/:id - Delete employee
router.delete(
  '/:id',
  validateEmployeeId,
  EmployeeController.deleteEmployee
);

export default router; 