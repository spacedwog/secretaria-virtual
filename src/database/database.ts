import { Pool } from 'pg';

export class Database {
  private static pool: Pool;

  // Inicializa o pool de conexões
  static init() {
    if (!this.pool) {
      this.pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'secretaria_virtual',
        password: '6z2h1j3k9F!', // Substitua por sua senha
        port: 3306,
      });
    }
    return this.pool;
  }

  // Executa uma consulta no banco de dados
  static async query(sql: string, params?: any[]): Promise<any> {
    console.log('Executando SQL:', sql, 'com parâmetros:', params);
    try {
      const result = await this.init().query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Erro na consulta ao banco de dados:', error);
      restartConnection();
      throw error;
    }
  }

  // Fecha o pool de conexões
  static async close() {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log('Conexão com o banco de dados encerrada.');
      } catch (error) {
        console.error('Erro ao fechar a conexão com o banco de dados:', error);
      }
    }
  }

  // Reinicia o pool de conexões
  static async restartConnection() {
    await this.close();
    this.init();
    console.log('Conexão com o banco de dados reiniciada.');
  }
}