declare class Database {
    private static instance;
    private constructor();
    static getInstance(): Database;
    connect(): Promise<void>;
    private setupConnectionListeners;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getConnectionInfo(): Promise<any>;
}
export default Database;
//# sourceMappingURL=database.d.ts.map