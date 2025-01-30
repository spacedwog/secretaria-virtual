var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as readlineSync from 'readline-sync';
import { DoctorService } from '../Back-end/doctor.service';
export class MenuSchedule {
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
                option = readlineSync.question('Escolha uma opcao: ');
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
                const appoitments = yield DoctorService.appoitmentView();
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
                console.error('Erro ao listar consultas medicas:', err);
            }
        });
    }
    // Adicionar um novo doutor
    addDoctor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = readlineSync.question('Nome do doutor: ');
                const phone = readlineSync.question('Telefone: ');
                const email = readlineSync.question('Email: ');
                const speciality = readlineSync.question('Especialidade: ');
                yield DoctorService.addDoctor(name, phone, email, speciality);
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
                const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
                const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
                yield DoctorService.visitDoctor(patientId, doctorId);
                console.log('Visita ao consultório medico registrada com sucesso!');
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
                const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
                const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
                const nomeConsultaMedica = readlineSync.question('Nome da consulta médica: ');
                const appoitmentDate = readlineSync.question('Data da consulta (aaaa/mm/dd): ');
                const appoitmentTime = readlineSync.question('Horario da consulta (hh:mm): ');
                const reason = readlineSync.question('Motivo da consulta: ');
                const status = readlineSync.question('Status da consulta (agendado/realizado): ');
                yield DoctorService.recordSchedule(patientId, doctorId, appoitmentDate, appoitmentTime, reason, status, nomeConsultaMedica);
                console.log('Consulta agendada com sucesso!');
            }
            catch (err) {
                console.error('Erro ao agendar consulta:', err);
            }
        });
    }
}
