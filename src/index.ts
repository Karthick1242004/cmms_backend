import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Database from './config/database';
import Logger from './utils/logger';
import departmentRoutes from './routes/departmentRoutes';
import shiftDetailRoutes from './routes/shiftDetailRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import safetyInspectionRoutes from './routes/safetyInspectionRoutes';
import employeeRoutes from './routes/employeeRoutes';
import assetRoutes from './routes/assetRoutes';
import ticketRoutes from './routes/ticketRoutes';
import meetingMinutesRoutes from './routes/meetingMinutesRoutes';
import dailyLogActivityRoutes from './routes/dailyLogActivityRoutes';
import noticeBoardRoutes from './routes/noticeBoardRoutes';
import locationRoutes from './routes/locationRoutes';
import partRoutes from './routes/partRoutes';
import stockTransactionRoutes from './routes/stockTransactionRoutes';
import chatRoutes from './routes/chatRoutes';
import profileRoutes from './routes/profileRoutes';

// Load environment variables
dotenv.config();

// Validate critical environment variables at startup
const validateEnvironment = () => {
  const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  
  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET!;
  
  // DEBUG: Log JWT_SECRET info (first/last 4 chars only for security)
  console.log('🔍 DEBUG: JWT_SECRET validation');
  console.log(`   - Exists: ${!!jwtSecret}`);
  console.log(`   - Length: ${jwtSecret?.length || 0} characters`);
  console.log(`   - Preview: ${jwtSecret ? jwtSecret.substring(0, 4) + '...' + jwtSecret.substring(jwtSecret.length - 4) : 'undefined'}`);
  
  if (jwtSecret.length < 32) {
    console.error('❌ CRITICAL: JWT_SECRET must be at least 32 characters long');
    console.error(`   Current length: ${jwtSecret.length}`);
    console.error(`   Required length: 32 or more`);
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully');
};

// Validate environment before starting server
validateEnvironment();

const app: Application = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Set production defaults for Railway
if (process.env.RAILWAY_ENVIRONMENT) {
  process.env.NODE_ENV = 'production';
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Secure CORS configuration
const allowedOrigins: string[] = [
  // Development origins
  'http://localhost:3000',
  'http://localhost:3001',
  // Production origins (specific domains only)
  'https://www.voneautomations.com',
  'https://cmms-dashboard.vercel.app',
  'https://cms-dashboard-frontend.vercel.app',
  'https://cms-dashboard-frontend-karthicks.vercel.app'
];

// Add frontend URL if provided and not already included
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  console.log(`✅ Added FRONTEND_URL to allowed origins: ${process.env.FRONTEND_URL}`);
}

console.log('🔒 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin only in development (for mobile apps, Postman, etc.)
    if (!origin && NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Reject requests with no origin in production
    if (!origin && NODE_ENV === 'production') {
      console.warn('🚫 CORS: Blocked request with no origin in production');
      return callback(new Error('Origin header required'), false);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin!)) {
      return callback(null, true);
    }
    
    // Log and reject unauthorized origins
    console.warn(`🚫 CORS: Blocked unauthorized origin: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS policy`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Has-More'],
  maxAge: 86400, // 24 hours
}));

// Body parsing middleware with error handling
app.use(express.json({ 
  limit: '5mb', // Reduced from 10mb to prevent memory issues
  verify: (req: any, res: any, buf: Buffer, encoding: string) => {
    if (buf.length > 0) {
      try {
        JSON.parse(buf.toString());
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid JSON in request body'
        });
        throw new Error('Invalid JSON');
      }
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '5mb', // Reduced from 10mb
  parameterLimit: 1000, // Limit number of parameters
  verify: (req: any, res: any, buf: Buffer, encoding: string) => {
    // Allow empty bodies for GET requests
    if (buf.length === 0 && req.method !== 'GET') {
      // Only check for non-GET requests
      return;
    }
  }
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Enhanced rate limiting for all environments
const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // More strict in production
    skipSuccessfulRequests: NODE_ENV === 'development',
    keyGenerator: (req) => {
      // Use forwarded IP in production, direct IP in development
      return req.ip || req.connection.remoteAddress || 'unknown';
    }
  });
};

// Apply different rate limits based on environment
if (NODE_ENV === 'production') {
  // Production: Stricter rate limiting
  app.use('/api/auth/', createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts')); // 5 per 15 minutes
  app.use('/api/', createRateLimiter(15 * 60 * 1000, 100, 'Too many API requests')); // 100 per 15 minutes
} else {
  // Development: More lenient but still protected
  app.use('/api/auth/', createRateLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts')); // 20 per 15 minutes
  app.use('/api/', createRateLimiter(15 * 60 * 1000, 500, 'Too many API requests')); // 500 per 15 minutes
}

console.log(`🔒 Rate limiting enabled for ${NODE_ENV} environment`);

// Health check endpoint
app.get('/health', async (req: Request, res: Response): Promise<void> => {
  const database = Database.getInstance();
  const isConnected = database.isConnected();
  
  try {
    let dbHealthy = false;
    let connectionInfo = null;
    
    if (isConnected) {
      // Perform a simple database operation to verify health
      connectionInfo = await database.getConnectionInfo();
      
      // Test database responsiveness with a ping
      const startTime = Date.now();
      await database.getConnectionInfo(); // Simple query to test responsiveness
      const responseTime = Date.now() - startTime;
      
      dbHealthy = responseTime < 5000; // Consider healthy if responds within 5 seconds
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
        collections: connectionInfo?.collections?.map((c: any) => c.name) || []
      }
    });
  } catch (error) {
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

// Database info endpoint
app.get('/api/database/info', async (req: Request, res: Response): Promise<void> => {
  try {
    const database = Database.getInstance();
    
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
        collections: connectionInfo.collections?.map((c: any) => ({
          name: c.name,
          type: c.type
        })) || []
      },
      message: 'Database information retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching database info:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving database information',
      error: NODE_ENV === 'development' ? error : undefined
    });
  }
});

// API routes
app.use('/api/departments', departmentRoutes);
app.use('/api/shift-details', shiftDetailRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/safety-inspection', safetyInspectionRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/meeting-minutes', meetingMinutesRoutes);
app.use('/api/daily-log-activities', dailyLogActivityRoutes);
app.use('/api/notice-board', noticeBoardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/stock-transactions', stockTransactionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response): void => {
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
        parts: '/api/parts',
        stock_transactions: '/api/stock-transactions',
        chat: '/api/chat',
        database_info: '/api/database/info'
      }
  });
});

// 404 handler
app.use('*', (req: Request, res: Response): void => {
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

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Global Error Handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => ({
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

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid resource ID format'
    });
    return;
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
    return;
  }

  // JWT errors
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

  // MongoDB connection errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
    res.status(503).json({
      success: false,
      message: 'Database connection error'
    });
    return;
  }

  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  Logger.critical('UNCAUGHT EXCEPTION! Shutting down...', error, {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  
  // Close server gracefully
  const database = Database.getInstance();
  database.disconnect().finally(() => {
    process.exit(1);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  Logger.critical('UNHANDLED PROMISE REJECTION! Shutting down...', reason, {
    reason,
    promise: promise.toString()
  });
  
  // Close server gracefully
  const database = Database.getInstance();
  database.disconnect().finally(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  const database = Database.getInstance();
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  const database = Database.getInstance();
  await database.disconnect();
  process.exit(0);
});

// Memory monitoring function
function monitorMemory() {
  const memUsage = process.memoryUsage();
  const maxMemory = 512 * 1024 * 1024; // 512MB limit for safety
  
  if (memUsage.rss > maxMemory) {
    console.warn('⚠️ High memory usage detected:', {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    });
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('🧹 Forced garbage collection');
    }
  }
}

// Start server
async function startServer() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect();

    // Start memory monitoring (every 30 seconds)
    setInterval(monitorMemory, 30000);

    // Clean old logs on startup
    Logger.cleanOldLogs();
    
    // Log server startup
    Logger.info('Server starting up', {
      port: PORT,
      environment: NODE_ENV,
      nodeVersion: process.version,
      pid: process.pid
    });

    // Get database info after connection
    const connectionInfo = await database.getConnectionInfo();
    console.log('📊 Connected to database:', connectionInfo.name);
    console.log('📚 Available collections:', connectionInfo.collections?.map((c: any) => c.name).join(', ') || 'None');

    // Start server with timeout configuration
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

    // Configure server timeouts to prevent hanging connections
    server.timeout = 30000; // 30 seconds
    server.keepAliveTimeout = 5000; // 5 seconds
    server.headersTimeout = 6000; // 6 seconds (must be greater than keepAliveTimeout)
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Check your MongoDB Atlas connection string and network access');
    process.exit(1);
  }
}

startServer(); 