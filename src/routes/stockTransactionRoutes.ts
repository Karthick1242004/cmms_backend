import { Router } from 'express';
import { StockTransactionController } from '../controllers/stockTransactionController';
import { 
  validateJWT, 
  requireAuth, 
  requireAccessLevel,
  enforceDepartmentAccess 
} from '../middleware/authMiddleware';

const router = Router();

// Apply JWT validation to all routes
router.use(validateJWT);

// GET /api/stock-transactions - Get all stock transactions with filtering
// All authenticated users can view transactions (with department filtering)
router.get(
  '/',
  enforceDepartmentAccess,
  StockTransactionController.getAllTransactions
);

// POST /api/stock-transactions - Create new stock transaction
// Admins and managers can create transactions
router.post(
  '/',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  StockTransactionController.createTransaction
);

// GET /api/stock-transactions/stats - Get transaction statistics
// All authenticated users can view stats (with department filtering)
router.get(
  '/stats',
  enforceDepartmentAccess,
  StockTransactionController.getTransactionStats
);

// GET /api/stock-transactions/:id - Get transaction by ID
// All authenticated users can view specific transactions
router.get(
  '/:id',
  StockTransactionController.getTransactionById
);

// PUT /api/stock-transactions/:id/status - Update transaction status (approve, complete, cancel)
// Admins and managers can update transaction status
router.put(
  '/:id/status',
  requireAuth({ 
    roles: ['admin', 'manager'],
    accessLevels: ['super_admin', 'department_admin'] 
  }),
  StockTransactionController.updateTransactionStatus
);

// DELETE /api/stock-transactions/:id - Delete transaction (only drafts)
// Only super admins can delete transactions
router.delete(
  '/:id',
  requireAccessLevel(['super_admin']),
  StockTransactionController.deleteTransaction
);

export default router;
