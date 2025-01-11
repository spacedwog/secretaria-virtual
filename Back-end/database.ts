import mysql from 'mysql2';

export class Database {
  
  private static pool: mysql.Pool;

  static async init() {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '6z2h1j3k9F!',
        database: 'secretaria_virtual',
      });
    }
  }

  static async query(queryText: string, params: any[] = []) {
    return new Promise<any>((resolve, reject) => {
      this.pool.execute(queryText, params, (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static close() {
    if (this.pool) {
      this.pool.end();
    }
  }
}