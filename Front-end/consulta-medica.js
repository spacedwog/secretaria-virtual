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
exports.MenuSchedule = void 0;
var readlineSync = require("readline-sync");
var doctor_service_1 = require("../Back-end/doctor.service");
var MenuSchedule = /** @class */ (function () {
    function MenuSchedule() {
    }
    MenuSchedule.prototype.consultaMedica = function () {
        return __awaiter(this, void 0, void 0, function () {
            var option, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('\n--- Painel de consulta médica ---');
                        console.log('1. Listar Consultas');
                        console.log('2. Adicionar Doutor');
                        console.log('3. Registrar Visita');
                        console.log('4. Agendar Consulta');
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
                    case 1: return [4 /*yield*/, this.listAppoitment()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 3: return [4 /*yield*/, this.addDoctor()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 5: return [4 /*yield*/, this.registerVisit()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 7: return [4 /*yield*/, this.recordSchedule()];
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
    MenuSchedule.prototype.listAppoitment = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appoitments, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, doctor_service_1.DoctorService.appoitmentView()];
                    case 1:
                        appoitments = _a.sent();
                        console.log('\n--- Lista de Consultas Médicas ---');
                        appoitments.forEach(function (appoitment) {
                            var date = new Date(appoitment.appointment_date).toDateString();
                            var paciente = appoitment.patient_name;
                            var doutor = appoitment.doctor_name;
                            var time = appoitment.appointment_time;
                            var status = appoitment.status;
                            console.table([
                                {
                                    Paciente: paciente,
                                    Doutor: doutor,
                                    Data: date,
                                    Hora: time,
                                    Status: status,
                                },
                            ]);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Erro ao listar consultas medicas:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Adicionar um novo doutor
    MenuSchedule.prototype.addDoctor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name_1, phone, email, speciality, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        name_1 = readlineSync.question('Nome do doutor: ');
                        phone = readlineSync.question('Telefone: ');
                        email = readlineSync.question('Email: ');
                        speciality = readlineSync.question('Especialidade: ');
                        return [4 /*yield*/, doctor_service_1.DoctorService.addDoctor(name_1, phone, email, speciality)];
                    case 1:
                        _a.sent();
                        console.log('Doutor adicionado com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error('Erro ao adicionar doutor:', err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Registrar visita
    MenuSchedule.prototype.registerVisit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, doctorId, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
                        doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
                        return [4 /*yield*/, doctor_service_1.DoctorService.visitDoctor(patientId, doctorId)];
                    case 1:
                        _a.sent();
                        console.log('Visita ao consultório medico registrada com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.error('Erro ao registrar visita:', err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Agendar consulta
    MenuSchedule.prototype.recordSchedule = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appointmentId, patientId, doctorId, nomeConsultaMedica, appoitmentDate, appoitmentTime, reason, status_1, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        appointmentId = parseInt(readlineSync.question('ID da consulta: '), 10);
                        patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
                        doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
                        nomeConsultaMedica = readlineSync.question('Nome da consulta médica: ');
                        appoitmentDate = readlineSync.question('Data da consulta (aaaa/mm/dd): ');
                        appoitmentTime = readlineSync.question('Horario da consulta (hh:mm): ');
                        reason = readlineSync.question('Motivo da consulta: ');
                        status_1 = readlineSync.question('Status da consulta (agendado/realizado): ');
                        return [4 /*yield*/, doctor_service_1.DoctorService.recordSchedule(appointmentId, patientId, doctorId, appoitmentDate, appoitmentTime, reason, status_1, nomeConsultaMedica)];
                    case 1:
                        _a.sent();
                        console.log('Consulta agendada com sucesso!');
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.error('Erro ao agendar consulta:', err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MenuSchedule;
}());
exports.MenuSchedule = MenuSchedule;
