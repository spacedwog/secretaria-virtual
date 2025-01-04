import { Pool } from 'pg';

export class Database {
  private static pool: Pool;

  // Inicializa o pool de conexões
  static init() {
    if (!this.pool) {
      this.pool = new Pool({
        user: 'postgres', // Substitua pelo seu usuário do banco
        host: 'localhost',
        database: 'secretaria_virtual',
        password: '6z2h1j3k9F!', // Substitua pela sua senha
        port: 3306,
      });
    }
    return this.pool;
  }

  // Executa uma consulta ao banco
  static async query(sql: string, params?: any[]): Promise<any> {
    try {
      const result = await this.init().query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Erro na consulta ao banco de dados:', error);
      throw error;
    }
  }

  // Fecha todas as conexões
  static async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}