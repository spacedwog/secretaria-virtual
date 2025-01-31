import * as mysql from 'mysql2';
export class Database {
    static pool;
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
    static async query(queryText, params = []) {
        return new Promise((resolve, reject) => {
            this.pool.execute(queryText, params, (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                }
                else {
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
