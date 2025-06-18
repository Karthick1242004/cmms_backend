"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_1 = require("../controllers/departmentController");
const departmentValidation_1 = require("../middleware/departmentValidation");
const router = (0, express_1.Router)();
// GET /api/departments - Get all departments with optional filtering and pagination
router.get('/', departmentValidation_1.validateDepartmentQuery, departmentController_1.DepartmentController.getAllDepartments);
// GET /api/departments/stats - Get department statistics
router.get('/stats', departmentController_1.DepartmentController.getDepartmentStats);
// GET /api/departments/:id - Get department by ID
router.get('/:id', departmentValidation_1.validateDepartmentId, departmentController_1.DepartmentController.getDepartmentById);
// POST /api/departments - Create new department
router.post('/', departmentValidation_1.validateCreateDepartment, departmentController_1.DepartmentController.createDepartment);
// PUT /api/departments/:id - Update department
router.put('/:id', departmentValidation_1.validateUpdateDepartment, departmentController_1.DepartmentController.updateDepartment);
// DELETE /api/departments/:id - Delete department
router.delete('/:id', departmentValidation_1.validateDepartmentId, departmentController_1.DepartmentController.deleteDepartment);
exports.default = router;
//# sourceMappingURL=departmentRoutes.js.map