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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const pg_1 = require("pg");
class Database {
    // Inicializa o pool de conexões
    static init() {
        if (!this.pool) {
            this.pool = new pg_1.Pool({
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
    static query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Executando SQL:', sql, 'com parâmetros:', params);
            try {
                const result = yield this.init().query(sql, params);
                return result.rows;
            }
            catch (error) {
                console.error('Erro na consulta ao banco de dados:', error);
                throw error;
            }
        });
    }
    // Fecha o pool de conexões
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pool) {
                try {
                    yield this.pool.end();
                    console.log('Conexão com o banco de dados encerrada.');
                }
                catch (error) {
                    console.error('Erro ao fechar a conexão com o banco de dados:', error);
                }
            }
        });
    }
    // Reinicia o pool de conexões
    static restartConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.close();
            this.init();
            console.log('Conexão com o banco de dados reiniciada.');
        });
    }
}
exports.Database = Database;
