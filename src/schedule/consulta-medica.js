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
exports.MenuSchedule = void 0;
const readline_sync_1 = __importDefault(require("readline-sync"));
const doctor_service_1 = require("../database/services/doctor.service");
class MenuSchedule {
    consultaMedica() {
        return __awaiter(this, void 0, void 0, function* () {
            let option;
            do {
                console.log('\n--- Painel de consulta médica ---');
                console.log('1. Listar Consultas');
                console.log('2. Adicionar Doutor');
                console.log('3. Registrar Visita');
                console.log('4. Agendar Consulta');
                console.log('v. Voltar');
                option = readline_sync_1.default.question('Escolha uma opcao: ');
                switch (option) {
                    case '1':
                        yield this.listAppoitment();
                        break;
                    case '2':
                        yield this.addDoctor();
                        break;
                    case '3':
                        yield this.registerVisit();
                        break;
                    case '4':
                        yield this.recordSchedule();
                        break;
                    case 'v':
                        console.log('Saindo do sistema...');
                        break;
                    default:
                        console.log('Opcao invalida. Tente novamente.');
                }
            } while (option !== 'v');
        });
    }
    // Listar todos os pacientes
    listAppoitment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appoitments = yield doctor_service_1.DoctorService.appoitmentView();
                console.log('\n--- Lista de Consultas Médicas ---');
                appoitments.forEach((appoitment) => {
                    const date = new Date(appoitment.appointment_date).toDateString();
                    const paciente = appoitment.patient_name;
                    const doutor = appoitment.doctor_name;
                    const time = appoitment.appointment_time;
                    const status = appoitment.status;
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
            }
            catch (err) {
                console.error('Erro ao listar consultas médicas:', err);
            }
        });
    }
    // Adicionar um novo doutor
    addDoctor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = readline_sync_1.default.question('Nome do doutor: ');
                const phone = readline_sync_1.default.question('Telefone: ');
                const email = readline_sync_1.default.question('Email: ');
                const speciality = readline_sync_1.default.question('Especialidade: ');
                yield doctor_service_1.DoctorService.addDoctor(name, phone, email, speciality);
                console.log('Doutor adicionado com sucesso!');
            }
            catch (err) {
                console.error('Erro ao adicionar doutor:', err);
            }
        });
    }
    // Registrar visita
    registerVisit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = parseInt(readline_sync_1.default.question('ID do paciente: '), 10);
                const doctorId = parseInt(readline_sync_1.default.question('ID do doutor: '), 10);
                yield doctor_service_1.DoctorService.visitDoctor(patientId, doctorId);
                console.log('Visita ao consultório médico registrada com sucesso!');
            }
            catch (err) {
                console.error('Erro ao registrar visita:', err);
            }
        });
    }
    // Agendar consulta
    recordSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = parseInt(readline_sync_1.default.question('ID do paciente: '), 10);
                const doctorId = parseInt(readline_sync_1.default.question('ID do doutor: '), 10);
                const appoitmentDate = readline_sync_1.default.question('Data da consulta (aaaa/mm/dd): ');
                const appoitmentTime = readline_sync_1.default.question('Horário da consulta (hh:mm): ');
                const reason = readline_sync_1.default.question('Motivo da consulta: ');
                const status = readline_sync_1.default.question('Status da consulta (agendado/realizado): ');
                yield doctor_service_1.DoctorService.recordSchedule(patientId, doctorId, appoitmentDate, appoitmentTime, reason, status);
                console.log('Consulta agendada com sucesso!');
            }
            catch (err) {
                console.error('Erro ao agendar consulta:', err);
            }
        });
    }
}
exports.MenuSchedule = MenuSchedule;
