import mysql from 'mysql2';

export class Database {
  private static connection: mysql.Connection;

  // Inicializar a conexão com o banco de dados MySQL
  static async init() {
    this.connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'mysql',
      password: '6z2h1j3k9F!',
      database: 'secretaria_virtual',
    });
  }

  // Método para executar consultas SQL
  static async query(queryText: string, params: any[] = []) {
    return new Promise<any>((resolve, reject) => {
      this.connection.execute(queryText, params, (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Fechar a conexão com o banco
  static close() {
    this.connection.end();
  }
}