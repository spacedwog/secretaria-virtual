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
                user: 'postgres', // Substitua pelo seu usuário do banco
                host: 'localhost',
                database: 'secretaria_virtual',
                password: 'sua_senha', // Substitua pela sua senha
                port: 5432,
            });
        }
        return this.pool;
    }
    // Executa uma consulta ao banco
    static query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.init().query(sql, params);
                return result.rows;
            }
            catch (error) {
                console.error('Erro na consulta ao banco de dados:', error.message);
                throw error;
            }
        });
    }
    // Fecha todas as conexões
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pool) {
                yield this.pool.end();
            }
        });
    }
}
exports.Database = Database;
