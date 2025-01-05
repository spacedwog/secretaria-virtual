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
function menuSchedule() {
    return __awaiter(this, void 0, void 0, function* () {
        let option;
        do {
            console.log('\n--- Sistema de Secretaria Virtual 2---');
            console.log('1. Cadastrar Doutor');
            console.log('2. Agendar Visita Médica');
            console.log('3. Agendar Consulta');
            console.log('4. Sair');
            option = readline_sync_1.default.question('Escolha uma opcao: ');
            switch (option) {
                case '1':
                    yield addDoctor();
                    break;
                case '2':
                    yield addVisit();
                    break;
                case '3':
                    yield scheduleAppoiment();
                    break;
                case '4':
                    console.log('Saindo do sistema...');
                    break;
                default:
                    console.log('Opcao invalida. Tente novamente.');
            }
        } while (option !== '5');
        database_1.Database.close(); // Fecha a conexão ao sair
    });
}
// Adicionar um novo paciente
function addDoctor() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const name = readline_sync_1.default.question('Nome do doutor: ');
            const email = readline_sync_1.default.question('Email: ');
            const phone = readline_sync_1.default.question('Telefone: ');
            const speciality = readline_sync_1.default.question('Especialidade: ');
            yield doctor_service_1.DoctorService.addDoctor(name, phone, email, speciality);
            console.log('Doutor adicionado com sucesso!');
        }
        catch (err) {
            console.error('Erro ao adicionar paciente:', err);
        }
    });
}
// Editar um paciente existente
function addVisit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patientId = parseInt(readline_sync_1.default.question('ID do paciente: '), 10);
            const doctorId = parseInt(readline_sync_1.default.question('ID do doutor: '), 10);
            yield doctor_service_1.DoctorService.visitDoctor(patientId, doctorId);
            console.log('Visita cadastrada com sucesso!');
        }
        catch (err) {
            console.error('Erro ao adicionar paciente:', err);
        }
    });
}
function scheduleAppoiment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appoitmentDate = readline_sync_1.default.question('Data da consulta: ');
            const appoitmentTime = readline_sync_1.default.question('Horário da consulta: ');
            const reasonAppoiment = readline_sync_1.default.question('Motivo da consulta: ');
            const statusAppoiment = readline_sync_1.default.question('Status da consulta: ');
            yield doctor_service_1.DoctorService.makeAppoitment(appoitmentDate, appoitmentTime, reasonAppoiment, statusAppoiment);
            console.log('Consulta agendada com sucesso!');
        }
        catch (err) {
            console.error('Erro ao adicionar consulta médica:', err);
        }
    });
}
// Ponto de entrada da aplicação
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Iniciando sistema de consulta médica...');
        yield menuSchedule();
        console.log('Sistema encerrado.');
    }
    catch (err) {
        console.error('Erro fatal na aplicação:', err);
        database_1.Database.close(); // Garante que a conexão será encerrada em caso de erro
    }
}))();
