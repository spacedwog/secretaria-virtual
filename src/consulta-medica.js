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
const database_1 = require("./database/database");
const doctor_service_1 = require("./database/services/doctor.service");
// Função para exibir o menu principal
function showMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        let option;
        do {
            console.log('\n--- Sistema de Secretaria Virtual ---');
            console.log('1. Listar Consultas');
            console.log('2. Adicionar Doutor');
            console.log('3. Registrar Visita');
            console.log('4. Consultar Agendamento');
            console.log('5. Sair');
            option = readline_sync_1.default.question('Escolha uma opcao: ');
            switch (option) {
                case '1':
                    yield listAppoitment();
                    break;
                case '2':
                    yield addDoctor();
                    break;
                case '3':
                    yield registerVisit();
                    break;
                case '4':
                    yield consultSchedule();
                    break;
                case '5':
                    console.log('Saindo do sistema...');
                    break;
                default:
                    console.log('Opcao invalida. Tente novamente.');
            }
        } while (option !== '5');
        database_1.Database.close(); // Fecha a conexão ao sair
    });
}
// Listar todos os pacientes
function listAppoitment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appoitment = yield doctor_service_1.DoctorService.appoitmentView();
            console.log('\n--- Lista de Consultas Médicas ---');
            appoitment.forEach((appoitment) => {
                console.log(`ID: ${appoitment.patient_id}, Nome: ${appoitment.patient_name}, Idade: ${appoitment.age}, Telefone: ${appoitment.phone}`);
            });
        }
        catch (err) {
            console.error('Erro ao listar consultas médicas:', err);
        }
    });
}
// Adicionar um novo paciente
function addDoctor() {
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
// Editar um paciente existente
function registerVisit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patientId = parseInt(readline_sync_1.default.question('ID do paciente: '), 10);
            const doctorId = parseInt(readline_sync_1.default.question('ID do doutor: '), 10);
            yield doctor_service_1.DoctorService.visitDoctor(patientId, doctorId);
        }
        catch (err) {
            console.error('Erro ao editar paciente:', err);
        }
    });
}
// Editar um paciente existente
function consultSchedule() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patientId = parseInt(readline_sync_1.default.question('ID do paciente: '), 10);
            const schedule = yield doctor_service_1.DoctorService.consultSchedule(patientId);
            ;
            console.log('\n--- Lista de Agendamentos ---');
            schedule.forEach((schedule) => {
                console.log(`Nome: ${schedule.patient_name}, E-mail: ${schedule.email}, Telefone: ${schedule.phone}, Data: ${schedule.appoitment_date}, Horário: ${schedule.appoitment_time}`);
            });
        }
        catch (err) {
            console.error('Erro ao editar paciente:', err);
        }
    });
}
// Ponto de entrada da aplicação
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Iniciando sistema de secretaria virtual...');
        yield showMenu();
        console.log('Sistema encerrado.');
    }
    catch (err) {
        console.error('Erro fatal na aplicação:', err);
        database_1.Database.close(); // Garante que a conexão será encerrada em caso de erro
    }
}))();
