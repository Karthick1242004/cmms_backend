import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Database from './config/database';
import departmentRoutes from './routes/departmentRoutes';

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
      'GET /api/departments/stats'
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
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Check your MongoDB Atlas connection string and network access');
    process.exit(1);
  }
}

startServer(); 