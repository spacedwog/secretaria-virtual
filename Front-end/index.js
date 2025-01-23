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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require("readline-sync");
var menu_paciente_1 = require("./menu-paciente");
var consulta_medica_1 = require("./consulta-medica");
var doctor_service_1 = require("../Back-end/doctor.service");
var etl_1 = require("../ELT/etl");
var MenuStarter = /** @class */ (function () {
    function MenuStarter() {
    }
    // Método principal do menu
    MenuStarter.prototype.menuPrincipal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var option, etl, err_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('\n--- Sistema de Secretaria Virtual ---');
                        console.log('1. Menu Paciente');
                        console.log('2. Menu Consulta Médica');
                        console.log('3. Receita Médica');
                        console.log('4. Imprimir Receita Médica');
                        console.log('5. Sair');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        etl = new etl_1.ETLProcess;
                        return [4 /*yield*/, etl.gerarCartaoPaciente()];
                    case 2:
                        _b.sent();
                        console.log(etl.getCartaoCadastro());
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.error('Erro ao executar o menu paciente:', err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        // Captura a escolha do usuário
                        option = readlineSync.question('Escolha uma opcao: ');
                        _a = option;
                        switch (_a) {
                            case '1': return [3 /*break*/, 5];
                            case '2': return [3 /*break*/, 7];
                            case '3': return [3 /*break*/, 9];
                            case '4': return [3 /*break*/, 11];
                            case '5': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 5: return [4 /*yield*/, this.menuPaciente()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 7: return [4 /*yield*/, this.menuConsultaMedica()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 9: return [4 /*yield*/, this.receitaMedica()];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 11: return [4 /*yield*/, this.imprimirReceitaMedica()];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        console.log('Saindo do sistema...');
                        return [3 /*break*/, 15];
                    case 14:
                        console.log('Opcao invalida. Escolha entre 1, 2 ou 5.');
                        _b.label = 15;
                    case 15:
                        if (option !== '5') return [3 /*break*/, 0];
                        _b.label = 16;
                    case 16:
                        console.log('Obrigado por usar o sistema. Até a próxima!');
                        return [2 /*return*/];
                }
            });
        });
    };
    // Método para acessar o menu do paciente
    MenuStarter.prototype.menuPaciente = function () {
        return __awaiter(this, void 0, void 0, function () {
            var paciente, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        paciente = new menu_paciente_1.MenuPacient();
                        return [4 /*yield*/, paciente.menuPaciente()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error('Erro ao executar o menu paciente:', err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Método para acessar o menu de consulta médica
    MenuStarter.prototype.menuConsultaMedica = function () {
        return __awaiter(this, void 0, void 0, function () {
            var medico, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        medico = new consulta_medica_1.MenuSchedule();
                        return [4 /*yield*/, medico.consultaMedica()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.error('Erro ao executar o menu consulta médica:', err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Registrar visita
    MenuStarter.prototype.receitaMedica = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, doctorId, codeMedicamento, recipId, recipName, tipoMedicamento, dataMed, recipQuantity, frequencyMed, consumation, observation, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
                        doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
                        codeMedicamento = readlineSync.question('Codigo do medicamento: ');
                        recipId = parseInt(readlineSync.question('ID do medicamento: '), 10);
                        recipName = readlineSync.question('Nome do medicamento: ');
                        tipoMedicamento = readlineSync.question('Tipo do medicamento: ');
                        dataMed = readlineSync.question('Data da medicacao (aaaa/mm/dd): ');
                        recipQuantity = readlineSync.question('Dosagem da medicacao: ');
                        frequencyMed = readlineSync.question('Frequência de medicacao: ');
                        consumation = readlineSync.question('Duracao da dose: ');
                        observation = readlineSync.question('Observacoes: ');
                        return [4 /*yield*/, doctor_service_1.DoctorService.medicRecip(patientId, doctorId, codeMedicamento, recipId, dataMed, observation, recipName, tipoMedicamento, frequencyMed, recipQuantity, consumation)];
                    case 1:
                        _a.sent();
                        console.log('Medicamento registrado com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.error('Erro ao registrar visita:', err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MenuStarter.prototype.imprimirReceitaMedica = function () {
        return __awaiter(this, void 0, void 0, function () {
            var recipId, receitas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipId = parseInt(readlineSync.question('ID do medicamento: '), 10);
                        return [4 /*yield*/, doctor_service_1.DoctorService.printMedicRecip(recipId)];
                    case 1:
                        receitas = _a.sent();
                        console.log('\n--- Lista de Receitas Médicas ---');
                        receitas.forEach(function (receitas) {
                            var date = new Date(receitas.data_prescricao).toDateString();
                            var dosagem = receitas.dosagem;
                            var frequencia = receitas.frequencia;
                            var duracao = receitas.duracao;
                            var observacao = receitas.observacoes;
                            console.table([
                                {
                                    Medicamento: receitas.nome_medicamento,
                                    Dosagem: dosagem,
                                    Frequencia: frequencia,
                                    Duracao: duracao,
                                    Observacao: observacao,
                                    Data: date
                                }
                            ]);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return MenuStarter;
}());
// Ponto de entrada da aplicação
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                menu = new MenuStarter();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log('Iniciando sistema de secretaria virtual...');
                return [4 /*yield*/, menu.menuPrincipal()];
            case 2:
                _a.sent();
                console.log('Sistema encerrado com sucesso.');
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.error('Erro fatal na aplicação:', err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
