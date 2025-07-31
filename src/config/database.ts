import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://karthick1242004:9894783774@karthick124.8ruyxjc.mongodb.net/cmms';

class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        await mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 10000, // Increased timeout
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
          heartbeatFrequencyMS: 10000,
          retryWrites: true,
          retryReads: true,
          maxIdleTimeMS: 30000,
          compressors: ['zlib'],
        });
        
        console.log('✅ Connected to MongoDB Atlas successfully');
        console.log('📊 Database name:', mongoose.connection.db?.databaseName);
        
        // Set up connection event listeners
        this.setupConnectionListeners();
        return;
        
      } catch (error) {
        retryCount++;
        console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('💥 Maximum connection retries exceeded. Exiting...');
          process.exit(1);
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        console.log(`⏳ Retrying connection in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private setupConnectionListeners(): void {
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    mongoose.connection.on('close', () => {
      console.log('🔌 MongoDB connection closed');
    });
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async getConnectionInfo(): Promise<any> {
    if (this.isConnected()) {
      return {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState,
        collections: await mongoose.connection.db?.listCollections().toArray()
      };
    }
    return null;
  }
}

export default Database; 