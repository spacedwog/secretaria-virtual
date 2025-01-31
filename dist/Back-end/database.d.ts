export declare class Database {
    private static pool;
    static init(): Promise<void>;
    static query(queryText: string, params?: any[]): Promise<any>;
    static close(): void;
}
