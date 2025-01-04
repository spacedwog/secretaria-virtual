"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// Criando conexão com o banco de dados
const connection = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'secretaria_virtual'
});
connection.connect((err) => {
    if (err) {
        console.error('Erro na conexão com o banco de dados:', err);
        return;
    }
    console.log('Conexão estabelecida com o banco de dados');
});
exports.default = connection;
