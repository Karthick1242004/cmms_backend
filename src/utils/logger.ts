import fs from 'fs';
import path from 'path';

export class Logger {
  private static instance: Logger;
  private logDir: string;

  private constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFileName(level: string): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${level}-${date}.log`);
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  }

  private writeLog(level: string, message: string, meta?: any): void {
    try {
      const logFile = this.getLogFileName(level);
      const formattedMessage = this.formatMessage(level, message, meta);
      
      fs.appendFileSync(logFile, formattedMessage);
      
      // Also write to general log
      const generalLogFile = this.getLogFileName('general');
      fs.appendFileSync(generalLogFile, formattedMessage);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  info(message: string, meta?: any): void {
    console.log(`ℹ️ ${message}`, meta || '');
    this.writeLog('info', message, meta);
  }

  warn(message: string, meta?: any): void {
    console.warn(`⚠️ ${message}`, meta || '');
    this.writeLog('warn', message, meta);
  }

  error(message: string, error?: any, meta?: any): void {
    console.error(`❌ ${message}`, error || '', meta || '');
    this.writeLog('error', message, { error: error?.message || error, stack: error?.stack, ...meta });
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🐛 ${message}`, meta || '');
      this.writeLog('debug', message, meta);
    }
  }

  // Critical errors that should be logged and monitored
  critical(message: string, error?: any, meta?: any): void {
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

    // In production, you could send this to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service (e.g., Sentry, LogRocket, etc.)
    }
  }

  // Clean old log files (older than 7 days)
  cleanOldLogs(): void {
    try {
      const files = fs.readdirSync(this.logDir);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          this.info(`Cleaned old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', error);
    }
  }
}

export default Logger.getInstance();