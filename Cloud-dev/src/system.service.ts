import { Database } from './database';

export class SystemService {
    private static _databaseInstance: Database;

  // Getter para inicializar e acessar a instância do Database
static get databaseInstance(): Database {
    if (!this._databaseInstance) {
        this._databaseInstance = new Database();
    }
    return this._databaseInstance;
}

  // Setter caso precise atualizar a instância do Database (se necessário)
static set databaseInstance(database: Database) {
    this._databaseInstance = database;
}

    static async register_middleware(
        type_middleware: string,
        descr_middleware: string
    ): Promise<void> {
        try {
            await Database.init(); // Alterado para chamar o método estático diretamente
            await Database.query(
                'CALL register_middleware(?, ?)',
                [type_middleware, descr_middleware]
            );
        }
        catch (error) {
            console.error('Error registering middleware:', error);
            throw new Error('Failed to register the middleware. Please check the input data and try again.');
        }
    }
}