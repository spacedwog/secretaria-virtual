import { PatientService } from '../Back-end/patient.service.ts';
export class ETLProcess {
    patientId = 0;
    patientAge = 0;
    patientName = "";
    patientPhone = "";
    patientEmail = "";
    patientAddress = "";
    cartaoCadastro = "";
    async gerarCartaoPaciente() {
        console.log('Gerando Cartão de Paciente');
        await this.extractDataPacient();
    }
    async extractDataPacient() {
        try {
            console.log('Extraindo Dados do Banco de Dados');
            const patients = await PatientService.listPatients();
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
    }
    async transformDataPacient() {
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
    }
    async loadDataPacient() {
        console.log('Carregando Dados para o Sistema');
        // Implementar a carga dos dados para o sistema
        // Exemplo: Salvar no banco de dados, gravar em um arquivo, etc.
        console.log('Cartão de Cadastro: ', this.getCartaoCadastro());
        console.log('Cartão de Cadastro Salvo com Sucesso');
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
