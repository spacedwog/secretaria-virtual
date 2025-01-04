"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const utils_1 = require("./utils");
const menu = () => {
    const opcao = readline_sync_1.default.question(`
    1. Inserir paciente
    2. Agendar consulta
    3. Exibir relatórios
    4. Sair
    Selecione uma opção: `);
    switch (opcao) {
        case '1':
            (0, utils_1.inserirPaciente)();
            break;
        case '2':
            (0, utils_1.agendarConsulta)();
            break;
        case '3':
            (0, utils_1.exibirRelatorios)();
            break;
        case '4':
            console.log('Saindo...');
            process.exit();
            break;
        default:
            console.log('Opção inválida!');
            menu();
    }
};
menu();
