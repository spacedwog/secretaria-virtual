var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PatientService } from '../Back-end/patient.service';
export class ETLProcess {
    constructor() {
        this.patientId = 0;
        this.patientAge = 0;
        this.patientName = "";
        this.patientPhone = "";
        this.patientEmail = "";
        this.patientAddress = "";
        this.cartaoCadastro = "";
    }
    gerarCartaoPaciente() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Gerando Cartão de Paciente');
            yield this.extractDataPacient();
        });
    }
    extractDataPacient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Extraindo Dados do Banco de Dados');
                const patients = yield PatientService.listPatients();
                patients.forEach((patient) => {
                    this.setPatientId(patient.patient_id);
                    this.setPatientName(patient.name);
                    this.setPatientAge(patient.age);
                    this.setPatientPhone(patient.phone);
                    this.setPatientEmail(patient.email);
                    this.setPatientAddress(patient.address);
                    this.transformDataPacient();
                });
            }
            catch (err) {
                console.error('Erro ao listar pacientes:', err);
            }
        });
    }
    transformDataPacient() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Transformando Dados');
            // Implementar a transformação dos dados
            const id_paciente = this.getPatientId();
            const nome_paciente = this.getPatientName();
            const idade_paciente = this.getPatientAge();
            const email_paciente = this.getPatientEmail();
            const telefone_paciente = this.getPatientPhone();
            const endereco_paciente = this.getPatientAddress();
            this.setCartaoCadastro("\nID: " + id_paciente + "\nO Paciente: " + nome_paciente + " foi cadastrado no sistema" +
                "\nDados do Paciente: " +
                "\n Nome: " + nome_paciente + " Idade: " + idade_paciente +
                "\n Telefone: " + telefone_paciente + " Email: " + email_paciente +
                "\n Endereco: " + endereco_paciente);
            this.loadDataPacient();
        });
    }
    loadDataPacient() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Carregando Dados para o Sistema');
            // Implementar a carga dos dados para o sistema
            // Exemplo: Salvar no banco de dados, gravar em um arquivo, etc.
            console.log('Cartão de Cadastro: ', this.getCartaoCadastro());
            console.log('Cartão de Cadastro Salvo com Sucesso');
        });
    }
    getPatientId() {
        return this.patientId;
    }
    getPatientName() {
        return this.patientName;
    }
    getPatientAge() {
        return this.patientAge;
    }
    getPatientPhone() {
        return this.patientPhone;
    }
    getPatientEmail() {
        return this.patientEmail;
    }
    getPatientAddress() {
        return this.patientAddress;
    }
    getCartaoCadastro() {
        return this.cartaoCadastro;
    }
    setPatientId(patient_id) {
        this.patientId = patient_id;
    }
    setPatientName(name) {
        this.patientName = name;
    }
    setPatientAge(age) {
        this.patientAge = age;
    }
    setPatientPhone(phone) {
        this.patientPhone = phone;
    }
    setPatientEmail(email) {
        this.patientEmail = email;
    }
    setPatientAddress(address) {
        this.patientAddress = address;
    }
    setCartaoCadastro(cartao_cadastro) {
        this.cartaoCadastro = cartao_cadastro;
    }
}
