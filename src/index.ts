import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Database from './config/database';
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

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

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

// CORS configuration
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://cmms-dashboard.vercel.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting (only in production)
if (NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// Health check endpoint
app.get('/health', async (req: Request, res: Response): Promise<void> => {
  const database = Database.getInstance();
  const isConnected = database.isConnected();
  
  try {
    const connectionInfo = isConnected ? await database.getConnectionInfo() : null;
    
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: {
        connected: isConnected,
        name: connectionInfo?.name || 'Not connected',
        collections: connectionInfo?.collections?.map((c: any) => c.name) || []
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: {
        connected: false,
        error: 'Unable to fetch database info'
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

// Start server
async function startServer() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect();

    // Get database info after connection
    const connectionInfo = await database.getConnectionInfo();
    console.log('📊 Connected to database:', connectionInfo.name);
    console.log('📚 Available collections:', connectionInfo.collections?.map((c: any) => c.name).join(', ') || 'None');

    // Start server
    app.listen(PORT, () => {
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
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Check your MongoDB Atlas connection string and network access');
    process.exit(1);
  }
}

startServer(); 