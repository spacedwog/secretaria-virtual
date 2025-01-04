"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
class Database {
    // Inicializar a conexão com o banco de dados MySQL
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql2_1.default.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: '6z2h1j3k9F!',
                database: 'secretaria_virtual',
            });
        });
    }
    // Método para executar consultas SQL
    static query(queryText_1) {
        return __awaiter(this, arguments, void 0, function* (queryText, params = []) {
            return new Promise((resolve, reject) => {
                this.connection.execute(queryText, params, (err, results) => {
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
    // Fechar a conexão com o banco
    static close() {
        this.connection.end();
    }
}
exports.Database = Database;
