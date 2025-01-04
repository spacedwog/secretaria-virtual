"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menu = exports.exibirRelatorios = exports.agendarConsulta = exports.inserirPaciente = void 0;
const readline_sync_1 = __importDefault(require("readline-sync"));
// src/utils/menu.ts
const relatorios_1 = require("./relatorios"); // Verifique se o caminho está correto
Object.defineProperty(exports, "inserirPaciente", { enumerable: true, get: function () { return relatorios_1.inserirPaciente; } });
Object.defineProperty(exports, "agendarConsulta", { enumerable: true, get: function () { return relatorios_1.agendarConsulta; } });
Object.defineProperty(exports, "exibirRelatorios", { enumerable: true, get: function () { return relatorios_1.exibirRelatorios; } });
const menu = () => {
    const opcao = readline_sync_1.default.question(`
    1. Inserir paciente
    2. Agendar consulta
    3. Exibir relatórios
    4. Sair
    Selecione uma opção: `);
    switch (opcao) {
        case '1':
            (0, relatorios_1.inserirPaciente)();
            break;
        case '2':
            (0, relatorios_1.agendarConsulta)();
            break;
        case '3':
            (0, relatorios_1.exibirRelatorios)();
            break;
        case '4':
            console.log('Saindo...');
            process.exit();
            break;
        default:
            console.log('Opção inválida!');
            (0, exports.menu)();
    }
};
exports.menu = menu;
