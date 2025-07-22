"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const router = (0, express_1.Router)();
// GET /api/tickets - Get all tickets with filtering, pagination, and department access control
router.get('/', ticketController_1.TicketController.getAllTickets);
// GET /api/tickets/stats - Get ticket statistics
router.get('/stats', ticketController_1.TicketController.getTicketStats);
// GET /api/tickets/my-tickets - Get tickets assigned to the current user
router.get('/my-tickets', ticketController_1.TicketController.getMyTickets);
// GET /api/tickets/department/:department - Get tickets for a specific department
router.get('/department/:department', ticketController_1.TicketController.getTicketsByDepartment);
// GET /api/tickets/asset/:assetId - Get tickets for a specific asset
router.get('/asset/:assetId', ticketController_1.TicketController.getTicketsByAsset);
// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', ticketController_1.TicketController.getTicketById);
// POST /api/tickets - Create new ticket
router.post('/', ticketController_1.TicketController.createTicket);
// PUT /api/tickets/:id - Update ticket
router.put('/:id', ticketController_1.TicketController.updateTicket);
// PATCH /api/tickets/:id/status - Update ticket status
router.patch('/:id/status', ticketController_1.TicketController.updateTicketStatus);
// PATCH /api/tickets/:id/assign - Assign ticket to users/departments
router.patch('/:id/assign', ticketController_1.TicketController.assignTicket);
// POST /api/tickets/:id/activity - Add activity log entry
router.post('/:id/activity', ticketController_1.TicketController.addActivityLog);
// DELETE /api/tickets/:id - Delete ticket (soft delete)
router.delete('/:id', ticketController_1.TicketController.deleteTicket);
exports.default = router;
//# sourceMappingURL=ticketRoutes.js.map