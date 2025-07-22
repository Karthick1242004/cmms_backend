import { Router } from 'express';
import { TicketController } from '../controllers/ticketController';

const router = Router();

// GET /api/tickets - Get all tickets with filtering, pagination, and department access control
router.get(
  '/',
  TicketController.getAllTickets
);

// GET /api/tickets/stats - Get ticket statistics
router.get(
  '/stats',
  TicketController.getTicketStats
);

// GET /api/tickets/my-tickets - Get tickets assigned to the current user
router.get(
  '/my-tickets',
  TicketController.getMyTickets
);

// GET /api/tickets/department/:department - Get tickets for a specific department
router.get(
  '/department/:department',
  TicketController.getTicketsByDepartment
);

// GET /api/tickets/asset/:assetId - Get tickets for a specific asset
router.get(
  '/asset/:assetId',
  TicketController.getTicketsByAsset
);

// GET /api/tickets/:id - Get ticket by ID
router.get(
  '/:id',
  TicketController.getTicketById
);

// POST /api/tickets - Create new ticket
router.post(
  '/',
  TicketController.createTicket
);

// PUT /api/tickets/:id - Update ticket
router.put(
  '/:id',
  TicketController.updateTicket
);

// PATCH /api/tickets/:id/status - Update ticket status
router.patch(
  '/:id/status',
  TicketController.updateTicketStatus
);

// PATCH /api/tickets/:id/assign - Assign ticket to users/departments
router.patch(
  '/:id/assign',
  TicketController.assignTicket
);

// POST /api/tickets/:id/activity - Add activity log entry
router.post(
  '/:id/activity',
  TicketController.addActivityLog
);

// DELETE /api/tickets/:id - Delete ticket (soft delete)
router.delete(
  '/:id',
  TicketController.deleteTicket
);

export default router; 