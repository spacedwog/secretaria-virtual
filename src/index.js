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
const readline_sync_1 = __importDefault(require("readline-sync"));
const menu_paciente_1 = require("./menu-paciente");
class MenuStarter {
    menuPrincipal() {
        return __awaiter(this, void 0, void 0, function* () {
            let option;
            do {
                console.log('\n--- Sistema de Secretaria Virtual ---');
                console.log('1. Menu Paciente');
                console.log('2. Menu Consulta Médica');
                console.log('5. Sair');
                const paciente = new menu_paciente_1.MenuPacient();
                const medico = new MedicSchedule();
                option = readline_sync_1.default.question('Escolha uma opcao: ');
                switch (option) {
                    case '1':
                        yield paciente.menuPaciente();
                        break;
                    case '2':
                        yield medico.consultaMedica();
                        break;
                    case '5':
                        console.log('Saindo do sistema...');
                        break;
                    default:
                        console.log('Opcao invalida. Tente novamente.');
                }
            } while (option !== '5');
        });
    }
}
// Ponto de entrada da aplicação
(() => __awaiter(void 0, void 0, void 0, function* () {
    const menu = new MenuStarter();
    try {
        console.log('Iniciando sistema de secretaria virtual...');
        yield menu.menuPrincipal();
        console.log('Sistema encerrado.');
    }
    catch (err) {
        console.error('Erro fatal na aplicação:', err);
    }
}))();
