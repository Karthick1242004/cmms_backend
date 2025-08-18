import { Router } from 'express';
import { StockTransactionController } from '../controllers/stockTransactionController';
import { extractUserContext, requireRole } from '../middleware/authMiddleware';

const router = Router();

// GET /api/stock-transactions - Get all stock transactions with filtering
router.get('/', extractUserContext, StockTransactionController.getAllTransactions);

// POST /api/stock-transactions - Create new stock transaction
router.post('/', extractUserContext, StockTransactionController.createTransaction);

// GET /api/stock-transactions/stats - Get transaction statistics
router.get('/stats', extractUserContext, StockTransactionController.getTransactionStats);

// GET /api/stock-transactions/:id - Get transaction by ID
router.get('/:id', extractUserContext, StockTransactionController.getTransactionById);

// PUT /api/stock-transactions/:id/status - Update transaction status (approve, complete, cancel)
router.put('/:id/status', extractUserContext, StockTransactionController.updateTransactionStatus);

// DELETE /api/stock-transactions/:id - Delete transaction (only drafts)
router.delete('/:id', extractUserContext, StockTransactionController.deleteTransaction);

export default router;
