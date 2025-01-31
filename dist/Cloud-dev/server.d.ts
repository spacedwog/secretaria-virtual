export declare class Server {
    private readonly app;
    private readonly port;
    private readonly dbConfig;
    private readonly dbRemidConfig;
    private connection;
    private pingInterval;
    private key;
    private value;
    constructor(port: number);
    private setupMiddlewares;
    private setupRoutes;
    private connectToDatabase;
    private viewMedicInfo;
    private viewWebsite;
    private getPacientes;
    private getReceita_medica;
    private generateReportRoute;
    private generateReport;
    private initialize;
    private checkPortAvailability;
    private getKey;
    private getValue;
    private setKey;
    private setValue;
}
