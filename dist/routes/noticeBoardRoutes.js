"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noticeBoardController_1 = require("../controllers/noticeBoardController");
const noticeBoardValidation_1 = require("../middleware/noticeBoardValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.extractUserContext);
router.get('/', noticeBoardValidation_1.validateGetNotices, noticeBoardController_1.getAllNoticeBoard);
router.get('/:id', noticeBoardController_1.getNoticeBoardById);
router.post('/', (0, authMiddleware_1.requireRole)(['admin']), noticeBoardValidation_1.validateCreateNotice, noticeBoardController_1.createNoticeBoard);
router.put('/:id', (0, authMiddleware_1.requireRole)(['admin']), noticeBoardValidation_1.validateUpdateNotice, noticeBoardController_1.updateNoticeBoard);
router.delete('/:id', (0, authMiddleware_1.requireRole)(['admin']), noticeBoardController_1.deleteNoticeBoard);
router.patch('/:id/publish', (0, authMiddleware_1.requireRole)(['admin']), noticeBoardValidation_1.validatePublishNotice, noticeBoardController_1.togglePublishNotice);
router.get('/stats/overview', (0, authMiddleware_1.requireRole)(['admin']), noticeBoardController_1.getNoticeBoardStats);
exports.default = router;
