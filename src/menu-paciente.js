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
exports.MenuPacient = void 0;
const readline_sync_1 = __importDefault(require("readline-sync"));
const patient_service_1 = require("./database/services/patient.service");
class MenuPacient {
    menuPaciente() {
        return __awaiter(this, void 0, void 0, function* () {
            let option;
            do {
                console.log('\n--- Sistema de Secretaria Virtual ---');
                console.log('1. Listar Pacientes');
                console.log('2. Adicionar Paciente');
                console.log('3. Editar Paciente');
                console.log('4. Excluir Paciente');
                console.log('5. Sair');
                option = readline_sync_1.default.question('Escolha uma opcao: ');
                switch (option) {
                    case '1':
                        yield this.listPatients();
                        break;
                    case '2':
                        yield this.addPatient();
                        break;
                    case '3':
                        yield this.editPatient();
                        break;
                    case '4':
                        yield this.deletePatient();
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
    // Listar todos os pacientes
    listPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patients = yield patient_service_1.PatientService.listPatients();
                console.log('\n--- Lista de Pacientes ---');
                patients.forEach((patient) => {
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
            }
            catch (err) {
                console.error('Erro ao listar pacientes:', err);
            }
        });
    }
    // Adicionar um novo paciente
    addPatient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = readline_sync_1.default.question('Nome do paciente: ');
                const age = parseInt(readline_sync_1.default.question('Idade: '), 10);
                const phone = readline_sync_1.default.question('Telefone: ');
                const email = readline_sync_1.default.question('Email: ');
                const address = readline_sync_1.default.question('Endereco: ');
                yield patient_service_1.PatientService.addPatient(name, age, phone, email, address);
                console.log('Paciente adicionado com sucesso!');
            }
            catch (err) {
                console.error('Erro ao adicionar paciente:', err);
            }
        });
    }
    // Editar um paciente existente
    editPatient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = parseInt(readline_sync_1.default.question('ID do paciente a ser editado: '), 10);
                const fieldsToUpdate = {};
                const name = readline_sync_1.default.question('Novo nome (deixe vazio para nao alterar): ');
                if (name)
                    fieldsToUpdate.name = name;
                const age = readline_sync_1.default.question('Nova idade (deixe vazio para nao alterar): ');
                if (age)
                    fieldsToUpdate.age = parseInt(age, 10);
                const phone = readline_sync_1.default.question('Novo telefone (deixe vazio para nao alterar): ');
                if (phone)
                    fieldsToUpdate.phone = phone;
                const email = readline_sync_1.default.question('Novo email (deixe vazio para nao alterar): ');
                if (email)
                    fieldsToUpdate.email = email;
                const address = readline_sync_1.default.question('Novo endereco (deixe vazio para nao alterar): ');
                if (address)
                    fieldsToUpdate.address = address;
                if (Object.keys(fieldsToUpdate).length > 0) {
                    yield patient_service_1.PatientService.editPatient(patientId, fieldsToUpdate);
                    console.log('Paciente atualizado com sucesso!');
                }
                else {
                    console.log('Nenhuma alteracao foi feita.');
                }
            }
            catch (err) {
                console.error('Erro ao editar paciente:', err);
            }
        });
    }
    // Excluir um paciente
    deletePatient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = parseInt(readline_sync_1.default.question('ID do paciente a ser excluido: '), 10);
                yield patient_service_1.PatientService.deletePatient(patientId);
                console.log('Paciente excluido com sucesso!');
            }
            catch (err) {
                console.error('Erro ao excluir paciente:', err);
            }
        });
    }
}
exports.MenuPacient = MenuPacient;
