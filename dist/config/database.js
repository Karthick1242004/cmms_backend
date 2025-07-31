"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://karthick1242004:9894783774@karthick124.8ruyxjc.mongodb.net/cmms';
class Database {
    constructor() { }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        const maxRetries = 5;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                await mongoose_1.default.connect(MONGODB_URI, {
                    bufferCommands: false,
                    maxPoolSize: 10,
                    serverSelectionTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,
                    heartbeatFrequencyMS: 10000,
                    retryWrites: true,
                    retryReads: true,
                    maxIdleTimeMS: 30000,
                    compressors: ['zlib'],
                });
                console.log('✅ Connected to MongoDB Atlas successfully');
                console.log('📊 Database name:', mongoose_1.default.connection.db?.databaseName);
                this.setupConnectionListeners();
                return;
            }
            catch (error) {
                retryCount++;
                console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, error);
                if (retryCount >= maxRetries) {
                    console.error('💥 Maximum connection retries exceeded. Exiting...');
                    process.exit(1);
                }
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
                console.log(`⏳ Retrying connection in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    setupConnectionListeners() {
        mongoose_1.default.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected successfully');
        });
        mongoose_1.default.connection.on('close', () => {
            console.log('🔌 MongoDB connection closed');
        });
    }
    async disconnect() {
        try {
            await mongoose_1.default.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
        catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
        }
    }
    isConnected() {
        return mongoose_1.default.connection.readyState === 1;
    }
    async getConnectionInfo() {
        if (this.isConnected()) {
            return {
                host: mongoose_1.default.connection.host,
                port: mongoose_1.default.connection.port,
                name: mongoose_1.default.connection.name,
                readyState: mongoose_1.default.connection.readyState,
                collections: await mongoose_1.default.connection.db?.listCollections().toArray()
            };
        }
        return null;
    }
}
exports.default = Database;
