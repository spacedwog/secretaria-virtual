var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as mysql from 'mysql2';
export class Database {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                this.pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '6z2h1j3k9F!',
                    database: 'secretaria_virtual',
                });
            }
        });
    }
    static query(queryText, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static close() {
        if (this.pool) {
            this.pool.end();
        }
    }
}
