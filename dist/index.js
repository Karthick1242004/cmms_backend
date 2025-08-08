"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const logger_1 = __importDefault(require("./utils/logger"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const shiftDetailRoutes_1 = __importDefault(require("./routes/shiftDetailRoutes"));
const maintenanceRoutes_1 = __importDefault(require("./routes/maintenanceRoutes"));
const safetyInspectionRoutes_1 = __importDefault(require("./routes/safetyInspectionRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const meetingMinutesRoutes_1 = __importDefault(require("./routes/meetingMinutesRoutes"));
const dailyLogActivityRoutes_1 = __importDefault(require("./routes/dailyLogActivityRoutes"));
const noticeBoardRoutes_1 = __importDefault(require("./routes/noticeBoardRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
const partRoutes_1 = __importDefault(require("./routes/partRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.RAILWAY_ENVIRONMENT) {
    process.env.NODE_ENV = 'production';
}
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://cmms-dashboard.vercel.app',
    'https://cms-dashboard-frontend.vercel.app',
    'https://cms-dashboard-frontend-karthicks.vercel.app'
];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        if (NODE_ENV === 'production' && origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        if (origin.endsWith('.railway.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'x-user-id',
        'x-user-name',
        'x-user-email',
        'x-user-department',
        'x-user-role'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Has-More'],
    maxAge: 86400,
}));
app.use(express_1.default.json({
    limit: '5mb',
    verify: (req, res, buf, encoding) => {
        if (buf.length > 0) {
            try {
                JSON.parse(buf.toString());
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid JSON in request body'
                });
                throw new Error('Invalid JSON');
            }
        }
    }
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '5mb',
    parameterLimit: 1000,
    verify: (req, res, buf, encoding) => {
        if (buf.length === 0 && req.method !== 'GET') {
            return;
        }
    }
}));
app.use((0, compression_1.default)());
if (NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
if (NODE_ENV === 'production') {
    app.use('/api/', limiter);
}
app.get('/health', async (req, res) => {
    const database = database_1.default.getInstance();
    const isConnected = database.isConnected();
    try {
        let dbHealthy = false;
        let connectionInfo = null;
        if (isConnected) {
            connectionInfo = await database.getConnectionInfo();
            const startTime = Date.now();
            await database.getConnectionInfo();
            const responseTime = Date.now() - startTime;
            dbHealthy = responseTime < 5000;
        }
        const statusCode = dbHealthy ? 200 : 503;
        res.status(statusCode).json({
            success: dbHealthy,
            message: dbHealthy ? 'Server is healthy' : 'Server is running but database is unhealthy',
            timestamp: new Date().toISOString(),
            environment: NODE_ENV,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            database: {
                connected: isConnected,
                healthy: dbHealthy,
                name: connectionInfo?.name || 'Not connected',
                collections: connectionInfo?.collections?.map((c) => c.name) || []
            }
        });
    }
    catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            success: false,
            message: 'Server is running but database health check failed',
            timestamp: new Date().toISOString(),
            environment: NODE_ENV,
            database: {
                connected: false,
                healthy: false,
                error: 'Health check failed'
            }
        });
    }
});
app.get('/api/database/info', async (req, res) => {
    try {
        const database = database_1.default.getInstance();
        if (!database.isConnected()) {
            res.status(503).json({
                success: false,
                message: 'Database not connected'
            });
            return;
        }
        const connectionInfo = await database.getConnectionInfo();
        res.status(200).json({
            success: true,
            data: {
                database: connectionInfo.name,
                host: connectionInfo.host,
                readyState: connectionInfo.readyState,
                collections: connectionInfo.collections?.map((c) => ({
                    name: c.name,
                    type: c.type
                })) || []
            },
            message: 'Database information retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching database info:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving database information',
            error: NODE_ENV === 'development' ? error : undefined
        });
    }
});
app.use('/api/departments', departmentRoutes_1.default);
app.use('/api/shift-details', shiftDetailRoutes_1.default);
app.use('/api/maintenance', maintenanceRoutes_1.default);
app.use('/api/safety-inspection', safetyInspectionRoutes_1.default);
app.use('/api/employees', employeeRoutes_1.default);
app.use('/api/assets', assetRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
app.use('/api/meeting-minutes', meetingMinutesRoutes_1.default);
app.use('/api/daily-log-activities', dailyLogActivityRoutes_1.default);
app.use('/api/notice-board', noticeBoardRoutes_1.default);
app.use('/api/locations', locationRoutes_1.default);
app.use('/api/parts', partRoutes_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CMMS Backend Server',
        version: '1.0.0',
        database: 'MongoDB Atlas - cmms',
        documentation: '/api/docs',
        health: '/health',
        endpoints: {
            departments: '/api/departments',
            shift_details: '/api/shift-details',
            maintenance: '/api/maintenance',
            safety_inspection: '/api/safety-inspection',
            employees: '/api/employees',
            assets: '/api/assets',
            tickets: '/api/tickets',
            meeting_minutes: '/api/meeting-minutes',
            daily_log_activities: '/api/daily-log-activities',
            notice_board: '/api/notice-board',
            locations: '/api/locations',
            database_info: '/api/database/info'
        }
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /api/database/info',
            'GET /api/departments',
            'POST /api/departments',
            'GET /api/departments/:id',
            'PUT /api/departments/:id',
            'DELETE /api/departments/:id',
            'GET /api/departments/stats',
            'GET /api/shift-details',
            'POST /api/shift-details',
            'GET /api/shift-details/:id',
            'PUT /api/shift-details/:id',
            'DELETE /api/shift-details/:id',
            'GET /api/shift-details/stats',
            'GET /api/maintenance/schedules',
            'POST /api/maintenance/schedules',
            'GET /api/maintenance/schedules/:id',
            'PUT /api/maintenance/schedules/:id',
            'DELETE /api/maintenance/schedules/:id',
            'GET /api/maintenance/records',
            'POST /api/maintenance/records',
            'GET /api/maintenance/records/:id',
            'PUT /api/maintenance/records/:id',
            'PATCH /api/maintenance/records/:id/verify',
            'DELETE /api/maintenance/records/:id',
            'GET /api/maintenance/stats',
            'GET /api/safety-inspection/schedules',
            'POST /api/safety-inspection/schedules',
            'GET /api/safety-inspection/schedules/:id',
            'PUT /api/safety-inspection/schedules/:id',
            'DELETE /api/safety-inspection/schedules/:id',
            'GET /api/safety-inspection/records',
            'POST /api/safety-inspection/records',
            'GET /api/safety-inspection/records/:id',
            'PUT /api/safety-inspection/records/:id',
            'PATCH /api/safety-inspection/records/:id/verify',
            'GET /api/safety-inspection/stats',
            'GET /api/employees',
            'POST /api/employees',
            'GET /api/employees/:id',
            'PUT /api/employees/:id',
            'DELETE /api/employees/:id',
            'GET /api/employees/stats',
            'GET /api/assets',
            'POST /api/assets',
            'GET /api/assets/:id',
            'PUT /api/assets/:id',
            'DELETE /api/assets/:id',
            'GET /api/assets/stats',
            'POST /api/assets/bulk-import',
            'GET /api/notice-board',
            'POST /api/notice-board',
            'GET /api/notice-board/:id',
            'PUT /api/notice-board/:id',
            'DELETE /api/notice-board/:id',
            'PATCH /api/notice-board/:id/publish',
            'GET /api/notice-board/stats/overview'
        ]
    });
});
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => ({
            field: err.path,
            message: err.message
        }));
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }
    if (error.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: 'Invalid resource ID format'
        });
        return;
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(409).json({
            success: false,
            message: `${field} already exists`
        });
        return;
    }
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired'
        });
        return;
    }
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
        res.status(503).json({
            success: false,
            message: 'Database connection error'
        });
        return;
    }
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(NODE_ENV === 'development' && { stack: error.stack })
    });
});
process.on('uncaughtException', (error) => {
    logger_1.default.critical('UNCAUGHT EXCEPTION! Shutting down...', error, {
        name: error.name,
        message: error.message,
        stack: error.stack
    });
    const database = database_1.default.getInstance();
    database.disconnect().finally(() => {
        process.exit(1);
    });
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.critical('UNHANDLED PROMISE REJECTION! Shutting down...', reason, {
        reason,
        promise: promise.toString()
    });
    const database = database_1.default.getInstance();
    database.disconnect().finally(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    const database = database_1.default.getInstance();
    await database.disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('🔄 SIGINT received, shutting down gracefully...');
    const database = database_1.default.getInstance();
    await database.disconnect();
    process.exit(0);
});
function monitorMemory() {
    const memUsage = process.memoryUsage();
    const maxMemory = 512 * 1024 * 1024;
    if (memUsage.rss > maxMemory) {
        console.warn('⚠️ High memory usage detected:', {
            rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
            external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
        });
        if (global.gc) {
            global.gc();
            console.log('🧹 Forced garbage collection');
        }
    }
}
async function startServer() {
    try {
        const database = database_1.default.getInstance();
        await database.connect();
        setInterval(monitorMemory, 30000);
        logger_1.default.cleanOldLogs();
        logger_1.default.info('Server starting up', {
            port: PORT,
            environment: NODE_ENV,
            nodeVersion: process.version,
            pid: process.pid
        });
        const connectionInfo = await database.getConnectionInfo();
        console.log('📊 Connected to database:', connectionInfo.name);
        console.log('📚 Available collections:', connectionInfo.collections?.map((c) => c.name).join(', ') || 'None');
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${NODE_ENV}`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
            console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
            console.log(`📊 Database Info: http://localhost:${PORT}/api/database/info`);
            console.log(`\n🔗 Available Endpoints:`);
            console.log(`   GET  / - Server info`);
            console.log(`   GET  /health - Health check`);
            console.log(`   GET  /api/database/info - Database information`);
            console.log(`   GET  /api/departments - List departments`);
            console.log(`   POST /api/departments - Create department`);
            console.log(`   GET  /api/departments/:id - Get department`);
            console.log(`   PUT  /api/departments/:id - Update department`);
            console.log(`   DEL  /api/departments/:id - Delete department`);
            console.log(`   GET  /api/departments/stats - Department statistics`);
            console.log(`   GET  /api/shift-details - List shift details`);
            console.log(`   POST /api/shift-details - Create shift detail`);
            console.log(`   GET  /api/shift-details/:id - Get shift detail`);
            console.log(`   PUT  /api/shift-details/:id - Update shift detail`);
            console.log(`   DEL  /api/shift-details/:id - Delete shift detail`);
            console.log(`   GET  /api/shift-details/stats - Shift detail statistics`);
            console.log(`   GET  /api/maintenance/schedules - List maintenance schedules`);
            console.log(`   POST /api/maintenance/schedules - Create maintenance schedule`);
            console.log(`   GET  /api/maintenance/schedules/:id - Get maintenance schedule`);
            console.log(`   PUT  /api/maintenance/schedules/:id - Update maintenance schedule`);
            console.log(`   DEL  /api/maintenance/schedules/:id - Delete maintenance schedule`);
            console.log(`   GET  /api/maintenance/records - List maintenance records`);
            console.log(`   POST /api/maintenance/records - Create maintenance record`);
            console.log(`   GET  /api/maintenance/records/:id - Get maintenance record`);
            console.log(`   PUT  /api/maintenance/records/:id - Update maintenance record`);
            console.log(`   PATCH /api/maintenance/records/:id/verify - Verify maintenance record`);
            console.log(`   DEL  /api/maintenance/records/:id - Delete maintenance record`);
            console.log(`   GET  /api/maintenance/stats - Maintenance statistics`);
            console.log(`   GET  /api/safety-inspection/schedules - List safety inspection schedules`);
            console.log(`   POST /api/safety-inspection/schedules - Create safety inspection schedule`);
            console.log(`   GET  /api/safety-inspection/schedules/:id - Get safety inspection schedule`);
            console.log(`   PUT  /api/safety-inspection/schedules/:id - Update safety inspection schedule`);
            console.log(`   DEL  /api/safety-inspection/schedules/:id - Delete safety inspection schedule`);
            console.log(`   GET  /api/safety-inspection/records - List safety inspection records`);
            console.log(`   POST /api/safety-inspection/records - Create safety inspection record`);
            console.log(`   GET  /api/safety-inspection/records/:id - Get safety inspection record`);
            console.log(`   PUT  /api/safety-inspection/records/:id - Update safety inspection record`);
            console.log(`   PATCH /api/safety-inspection/records/:id/verify - Verify safety inspection record`);
            console.log(`   GET  /api/safety-inspection/stats - Safety inspection statistics`);
            console.log(`   GET  /api/employees - List employees`);
            console.log(`   POST /api/employees - Create employee`);
            console.log(`   GET  /api/employees/:id - Get employee`);
            console.log(`   PUT  /api/employees/:id - Update employee`);
            console.log(`   DEL  /api/employees/:id - Delete employee`);
            console.log(`   GET  /api/employees/stats - Employee statistics`);
            console.log(`   GET  /api/assets - List assets`);
            console.log(`   POST /api/assets - Create asset`);
            console.log(`   GET  /api/assets/:id - Get asset`);
            console.log(`   PUT  /api/assets/:id - Update asset`);
            console.log(`   DEL  /api/assets/:id - Delete asset`);
            console.log(`   GET  /api/assets/stats - Asset statistics`);
            console.log(`   POST /api/assets/bulk-import - Bulk import assets`);
        });
        server.timeout = 30000;
        server.keepAliveTimeout = 5000;
        server.headersTimeout = 6000;
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('💡 Check your MongoDB Atlas connection string and network access');
        process.exit(1);
    }
}
startServer();
