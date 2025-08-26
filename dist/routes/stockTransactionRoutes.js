"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockTransactionController_1 = require("../controllers/stockTransactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.validateJWT);
router.get('/', authMiddleware_1.enforceDepartmentAccess, stockTransactionController_1.StockTransactionController.getAllTransactions);
router.post('/', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), stockTransactionController_1.StockTransactionController.createTransaction);
router.get('/stats', authMiddleware_1.enforceDepartmentAccess, stockTransactionController_1.StockTransactionController.getTransactionStats);
router.get('/:id', stockTransactionController_1.StockTransactionController.getTransactionById);
router.put('/:id/status', (0, authMiddleware_1.requireAuth)({
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin']
}), stockTransactionController_1.StockTransactionController.updateTransactionStatus);
router.delete('/:id', (0, authMiddleware_1.requireAccessLevel)(['super_admin']), stockTransactionController_1.StockTransactionController.deleteTransaction);
exports.default = router;
