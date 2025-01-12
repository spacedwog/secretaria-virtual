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
exports.MenuPacient = void 0;
var readlineSync = require("readline-sync");
var patient_service_1 = require("../Back-end/patient.service");
var MenuPacient = /** @class */ (function () {
    function MenuPacient() {
    }
    MenuPacient.prototype.menuPaciente = function () {
        return __awaiter(this, void 0, void 0, function () {
            var option, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('\n--- Sistema de Secretaria Virtual ---');
                        console.log('1. Listar Pacientes');
                        console.log('2. Adicionar Paciente');
                        console.log('3. Editar Paciente');
                        console.log('4. Excluir Paciente');
                        console.log('v. Voltar');
                        option = readlineSync.question('Escolha uma opcao: ');
                        _a = option;
                        switch (_a) {
                            case '1': return [3 /*break*/, 1];
                            case '2': return [3 /*break*/, 3];
                            case '3': return [3 /*break*/, 5];
                            case '4': return [3 /*break*/, 7];
                            case 'v': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 1: return [4 /*yield*/, this.listPatients()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 3: return [4 /*yield*/, this.addPatient()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 5: return [4 /*yield*/, this.editPatient()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 7: return [4 /*yield*/, this.deletePatient()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        console.log('Saindo do sistema...');
                        return [3 /*break*/, 11];
                    case 10:
                        console.log('Opcao invalida. Tente novamente.');
                        _b.label = 11;
                    case 11:
                        if (option !== 'v') return [3 /*break*/, 0];
                        _b.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // Listar todos os pacientes
    MenuPacient.prototype.listPatients = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patients, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, patient_service_1.PatientService.listPatients()];
                    case 1:
                        patients = _a.sent();
                        console.log('\n--- Lista de Pacientes ---');
                        patients.forEach(function (patient) {
                            console.table([
                                {
                                    "ID": patient.patient_id,
                                    "Nome do Paciente": patient.name,
                                    "Idade": patient.age,
                                    "Telefone": patient.phone,
                                    "Email": patient.email,
                                    "Endereco": patient.address
                                }
                            ]);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Erro ao listar pacientes:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Adicionar um novo paciente
    MenuPacient.prototype.addPatient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name_1, age, phone, email, address, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        name_1 = readlineSync.question('Nome do paciente: ');
                        age = parseInt(readlineSync.question('Idade: '), 10);
                        phone = readlineSync.question('Telefone: ');
                        email = readlineSync.question('Email: ');
                        address = readlineSync.question('Endereco: ');
                        return [4 /*yield*/, patient_service_1.PatientService.addPatient(name_1, age, phone, email, address)];
                    case 1:
                        _a.sent();
                        console.log('Paciente adicionado com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error('Erro ao adicionar paciente:', err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Editar um paciente existente
    MenuPacient.prototype.editPatient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, fieldsToUpdate, name_2, age, phone, email, address, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        patientId = parseInt(readlineSync.question('ID do paciente a ser editado: '), 10);
                        fieldsToUpdate = {};
                        name_2 = readlineSync.question('Novo nome (deixe vazio para nao alterar): ');
                        if (name_2)
                            fieldsToUpdate.name = name_2;
                        age = readlineSync.question('Nova idade (deixe vazio para nao alterar): ');
                        if (age)
                            fieldsToUpdate.age = parseInt(age, 10);
                        phone = readlineSync.question('Novo telefone (deixe vazio para nao alterar): ');
                        if (phone)
                            fieldsToUpdate.phone = phone;
                        email = readlineSync.question('Novo email (deixe vazio para nao alterar): ');
                        if (email)
                            fieldsToUpdate.email = email;
                        address = readlineSync.question('Novo endereco (deixe vazio para nao alterar): ');
                        if (address)
                            fieldsToUpdate.address = address;
                        if (!(Object.keys(fieldsToUpdate).length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, patient_service_1.PatientService.editPatient(patientId, fieldsToUpdate)];
                    case 1:
                        _a.sent();
                        console.log('Paciente atualizado com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('Nenhuma alteracao foi feita.');
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        console.error('Erro ao editar paciente:', err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Excluir um paciente
    MenuPacient.prototype.deletePatient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = parseInt(readlineSync.question('ID do paciente a ser excluido: '), 10);
                        return [4 /*yield*/, patient_service_1.PatientService.deletePatient(patientId)];
                    case 1:
                        _a.sent();
                        console.log('Paciente excluido com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.error('Erro ao excluir paciente:', err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MenuPacient;
}());
exports.MenuPacient = MenuPacient;
