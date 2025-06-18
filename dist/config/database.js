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
        try {
            await mongoose_1.default.connect(MONGODB_URI, {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log('✅ Connected to MongoDB Atlas successfully');
            console.log('📊 Database name:', mongoose_1.default.connection.db?.databaseName);
        }
        catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
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
//# sourceMappingURL=database.js.map