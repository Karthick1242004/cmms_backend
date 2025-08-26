"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Logger {
    constructor() {
        this.logDir = path_1.default.join(process.cwd(), 'logs');
        this.ensureLogDirectory();
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    ensureLogDirectory() {
        if (!fs_1.default.existsSync(this.logDir)) {
            fs_1.default.mkdirSync(this.logDir, { recursive: true });
        }
    }
    getLogFileName(level) {
        const date = new Date().toISOString().split('T')[0];
        return path_1.default.join(this.logDir, `${level}-${date}.log`);
    }
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
    }
    writeLog(level, message, meta) {
        try {
            const logFile = this.getLogFileName(level);
            const formattedMessage = this.formatMessage(level, message, meta);
            fs_1.default.appendFileSync(logFile, formattedMessage);
            const generalLogFile = this.getLogFileName('general');
            fs_1.default.appendFileSync(generalLogFile, formattedMessage);
        }
        catch (error) {
            console.error('Failed to write log:', error);
        }
    }
    info(message, meta) {
        console.log(`ℹ️ ${message}`, meta || '');
        this.writeLog('info', message, meta);
    }
    warn(message, meta) {
        console.warn(`⚠️ ${message}`, meta || '');
        this.writeLog('warn', message, meta);
    }
    error(message, error, meta) {
        console.error(`❌ ${message}`, error || '', meta || '');
        this.writeLog('error', message, { error: error?.message || error, stack: error?.stack, ...meta });
    }
    debug(message, meta) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`🐛 ${message}`, meta || '');
            this.writeLog('debug', message, meta);
        }
    }
    critical(message, error, meta) {
        const criticalData = {
            message,
            error: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            process: {
                pid: process.pid,
                memory: process.memoryUsage(),
                uptime: process.uptime()
            },
            ...meta
        };
        console.error(`💥 CRITICAL: ${message}`, criticalData);
        this.writeLog('critical', message, criticalData);
        if (process.env.NODE_ENV === 'production') {
        }
    }
    cleanOldLogs() {
        try {
            const files = fs_1.default.readdirSync(this.logDir);
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            files.forEach(file => {
                const filePath = path_1.default.join(this.logDir, file);
                const stats = fs_1.default.statSync(filePath);
                if (stats.mtime.getTime() < sevenDaysAgo) {
                    fs_1.default.unlinkSync(filePath);
                    this.info(`Cleaned old log file: ${file}`);
                }
            });
        }
        catch (error) {
            this.error('Failed to clean old logs', error);
        }
    }
}
exports.Logger = Logger;
exports.default = Logger.getInstance();
