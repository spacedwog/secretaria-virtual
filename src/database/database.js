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
exports.pool = void 0;
exports.query = query;
const pg_1 = require("pg"); // Usando PostgreSQL como exemplo de banco de dados
exports.pool = new pg_1.Pool({
    user: 'user', // Substitua com seu usuário do banco de dados
    host: 'localhost',
    database: 'secretaria_virtual',
    password: '6z2h1j3k9F!', // Substitua com sua senha
    port: 5432,
});
function query(text, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield exports.pool.query(text, params);
        return res.rows;
    });
}
