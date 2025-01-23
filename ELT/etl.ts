import { PatientService } from '../Back-end/patient.service';

export class ETLProcess{

    private patientId: number = 0;
    private patientName: string = "";
    private patientAge: number = 0;
    private patientPhone: string = "";
    private patientEmail: string = "";
    private patientAddress: string = "";
    private cartaoCadastro: string = "";

    public async extractData() {
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
            this.transformData();
          });
        } catch (err) {
          console.error('Erro ao listar pacientes:', err);
        }
    }

    public async transformData() {

      console.log('Transformando Dados');
      // Implementar a transformação dos dados
      const id_paciente = this.getPatientId();
      const nome_paciente = this.getPatientName();
      const idade_paciente = this.getPatientAge();
      const email_paciente = this.getPatientEmail();
      const telefone_paciente = this.getPatientPhone();
      const endereco_paciente = this.getPatientAddress();
      
      this.setCartaoCadastro(
        "ID: " + id_paciente + "\nO Paciente: " + nome_paciente + " foi cadastrado no sistema" +
        "\nDados do Paciente: " +
        "\n Nome: " + nome_paciente + " Idade: " + idade_paciente +
        "\n Telefone: " + telefone_paciente + " Email: " + email_paciente +
        "\n Endereco: " + endereco_paciente
      );
      this.loadData();

    }

    public async loadData() {
      console.log('Carregando Dados para o Sistema');
      // Implementar a carga dos dados para o sistema
      // Exemplo: Salvar no banco de dados, gravar em um arquivo, etc.
      console.log('Cartão de Cadastro: ', this.getCartaoCadastro());
      console.log('Cartão de Cadastro Salvo com Sucesso');
    }

    public getPatientId(){
      return this.patientId;
    }
    public getPatientName(){
      return this.patientName;
    }
    public getPatientAge(){
      return this.patientAge;
    }
    public getPatientPhone(){
      return this.patientPhone;
    }
    public getPatientEmail(){
      return this.patientEmail;
    }
    public getPatientAddress(){
      return this.patientAddress;
    }
    public getCartaoCadastro(){
      return this.cartaoCadastro;
    }

    public setPatientId(patient_id: number) {
      this.patientId = patient_id;
    }
    public setPatientName(name: string) {
      this.patientName = name;
    }
    public setPatientAge(age: number) {
      this.patientAge = age;
    }
    public setPatientPhone(phone: string) {
      this.patientPhone = phone;
    }
    public setPatientEmail(email: string) {
      this.patientEmail = email;
    }
    public setPatientAddress(address: string) {
      this.patientAddress = address;
    }
    public setCartaoCadastro(cartao_cadastro: string) {
      this.cartaoCadastro = cartao_cadastro;
    }
}