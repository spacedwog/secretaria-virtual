var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as readlineSync from 'readline-sync';
import { PatientService } from '../Back-end/patient.service';
export class MenuPacient {
    menuPaciente() {
        return __awaiter(this, void 0, void 0, function* () {
            let option;
            do {
                console.log('\n--- Sistema de Secretaria Virtual ---');
                console.log('1. Listar Pacientes');
                console.log('2. Adicionar Paciente');
                console.log('3. Editar Paciente');
                console.log('4. Excluir Paciente');
                console.log('v. Voltar');
                option = readlineSync.question('Escolha uma opcao: ');
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
    listPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patients = yield PatientService.listPatients();
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
                const name = readlineSync.question('Nome do paciente: ');
                const age = parseInt(readlineSync.question('Idade: '), 10);
                const phone = readlineSync.question('Telefone: ');
                const email = readlineSync.question('Email: ');
                const address = readlineSync.question('Endereco: ');
                yield PatientService.addPatient(name, age, phone, email, address);
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
                const patientId = parseInt(readlineSync.question('ID do paciente a ser editado: '), 10);
                const fieldsToUpdate = {};
                const name = readlineSync.question('Novo nome (deixe vazio para nao alterar): ');
                if (name)
                    fieldsToUpdate.name = name;
                const age = readlineSync.question('Nova idade (deixe vazio para nao alterar): ');
                if (age)
                    fieldsToUpdate.age = parseInt(age, 10);
                const phone = readlineSync.question('Novo telefone (deixe vazio para nao alterar): ');
                if (phone)
                    fieldsToUpdate.phone = phone;
                const email = readlineSync.question('Novo email (deixe vazio para nao alterar): ');
                if (email)
                    fieldsToUpdate.email = email;
                const address = readlineSync.question('Novo endereco (deixe vazio para nao alterar): ');
                if (address)
                    fieldsToUpdate.address = address;
                if (Object.keys(fieldsToUpdate).length > 0) {
                    yield PatientService.editPatient(patientId, fieldsToUpdate);
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
                const patientId = parseInt(readlineSync.question('ID do paciente a ser excluido: '), 10);
                yield PatientService.deletePatient(patientId);
                console.log('Paciente excluido com sucesso!');
            }
            catch (err) {
                console.error('Erro ao excluir paciente:', err);
            }
        });
    }
}
