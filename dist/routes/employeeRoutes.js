"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const employeeValidation_1 = require("../middleware/employeeValidation");
const router = (0, express_1.Router)();
// GET /api/employees - Get all employees with optional filtering and pagination
router.get('/', employeeValidation_1.validateEmployeeQuery, employeeController_1.EmployeeController.getAllEmployees);
// GET /api/employees/stats - Get employee statistics
router.get('/stats', employeeController_1.EmployeeController.getEmployeeStats);
// GET /api/employees/:id - Get employee by ID
router.get('/:id', employeeValidation_1.validateEmployeeId, employeeController_1.EmployeeController.getEmployeeById);
// POST /api/employees - Create new employee
router.post('/', employeeValidation_1.validateCreateEmployee, employeeController_1.EmployeeController.createEmployee);
// PUT /api/employees/:id - Update employee
router.put('/:id', employeeValidation_1.validateUpdateEmployee, employeeController_1.EmployeeController.updateEmployee);
// DELETE /api/employees/:id - Delete employee
router.delete('/:id', employeeValidation_1.validateEmployeeId, employeeController_1.EmployeeController.deleteEmployee);
exports.default = router;
//# sourceMappingURL=employeeRoutes.js.map