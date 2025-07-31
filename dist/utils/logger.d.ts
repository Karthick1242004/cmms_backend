export declare class Logger {
    private static instance;
    private logDir;
    private constructor();
    static getInstance(): Logger;
    private ensureLogDirectory;
    private getLogFileName;
    private formatMessage;
    private writeLog;
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, error?: any, meta?: any): void;
    debug(message: string, meta?: any): void;
    critical(message: string, error?: any, meta?: any): void;
    cleanOldLogs(): void;
}
declare const _default: Logger;
export default _default;
//# sourceMappingURL=logger.d.ts.map