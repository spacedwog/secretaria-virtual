import { gerarRelatorioJSON, gerarRelatorioHTML, gerarRelatorioPDF } from './relatorios'; // Importa as funções de relatório

class SecretariaVirtual {
    private pacientes: any[] = []; // Lista de pacientes
    private consultas: any[] = []; // Lista de consultas

    // Getters e Setters para pacientes
    public getPacientes(): any[] {
        return this.pacientes;
    }

    public setPacientes(pacientes: any[]): void {
        this.pacientes = pacientes;
    }

    // Getters e Setters para consultas
    public getConsultas(): any[] {
        return this.consultas;
    }

    public setConsultas(consultas: any[]): void {
        this.consultas = consultas;
    }

    // Getter e Setter para nome do paciente
    private nome: string = '';
    public getNome(): string {
        return this.nome;
    }
    public setNome(nome: string): void {
        this.nome = nome;
    }

    // Getter e Setter para telefone do paciente
    private telefone: string = '';
    public getTelefone(): string {
        return this.telefone;
    }
    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    // Getter e Setter para email do paciente
    private email: string = '';
    public getEmail(): string {
        return this.email;
    }
    public setEmail(email: string): void {
        this.email = email;
    }

    // Getter e Setter para data de nascimento do paciente
    private dataNascimento: string = '';
    public getDataNascimento(): string {
        return this.dataNascimento;
    }
    public setDataNascimento(dataNascimento: string): void {
        this.dataNascimento = dataNascimento;
    }

    // Getter e Setter para ID do paciente
    private pacienteId: number = 0;
    public getPacienteId(): number {
        return this.pacienteId;
    }
    public setPacienteId(pacienteId: number): void {
        this.pacienteId = pacienteId;
    }

    // Getter e Setter para data da consulta
    private dataConsulta: string = '';
    public getDataConsulta(): string {
        return this.dataConsulta;
    }
    public setDataConsulta(dataConsulta: string): void {
        this.dataConsulta = dataConsulta;
    }

    // Função para inserir paciente (exemplo básico)
    private inserirPaciente(): void {
        console.log(`Inserindo paciente: ${this.getNome()}`);
        // Lógica para inserir paciente no banco de dados (simulação)
        const paciente = {
            nome: this.getNome(),
            telefone: this.getTelefone(),
            email: this.getEmail(),
            dataNascimento: this.getDataNascimento(),
        };
        this.pacientes.push(paciente);  // Adicionando o paciente à lista
        console.log(`Paciente ${this.getNome()} inserido com sucesso!`);
    }

    // Função para agendar consulta (exemplo básico)
    private agendarConsulta(): void {
        console.log(`Agendando consulta para o paciente ID: ${this.getPacienteId()} na data ${this.getDataConsulta()}`);
        // Lógica para agendar consulta no banco de dados (simulação)
        const consulta = {
            pacienteId: this.getPacienteId(),
            dataConsulta: this.getDataConsulta(),
        };
        this.consultas.push(consulta);  // Adicionando a consulta à lista
        console.log(`Consulta agendada com sucesso para o paciente ${this.getPacienteId()}`);
    }

    // Função para exibir relatórios (chama as funções de gerar relatório)
    private exibirRelatorios(): void {
        console.log('Exibindo relatórios...');
        gerarRelatorioJSON();
        gerarRelatorioHTML();
        gerarRelatorioPDF();
    }

    // Menu principal da aplicação (interação com o usuário)
    public exibirMenu(): void {
        const prompt = require('prompt-sync')();
        let opcao = '';

        do {
            console.log('Bem-vindo ao Sistema de Secretária Virtual!');
            console.log('1. Inserir Paciente');
            console.log('2. Agendar Consulta');
            console.log('3. Exibir Relatórios');
            console.log('4. Sair');
            
            opcao = prompt('Escolha uma opção: ');

            switch (opcao) {
                case '1':
                    this.setNome(prompt('Nome do Paciente: '));
                    this.setTelefone(prompt('Telefone: '));
                    this.setEmail(prompt('Email: '));
                    this.setDataNascimento(prompt('Data de Nascimento (YYYY-MM-DD): '));
                    this.inserirPaciente();
                    break;
                case '2':
                    this.setPacienteId(parseInt(prompt('ID do Paciente: '), 10));
                    this.setDataConsulta(prompt('Data da Consulta (YYYY-MM-DD): '));
                    this.agendarConsulta();
                    break;
                case '3':
                    this.exibirRelatorios();
                    break;
                case '4':
                    console.log('Saindo...');
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
            }
        } while (opcao !== '4');
    }
}

// Criando uma instância da classe e executando o menu
const secretaria = new SecretariaVirtual();
secretaria.exibirMenu();

// Exemplo de uso dos getters e setters
console.log("Pacientes:", secretaria.getPacientes());
secretaria.setPacientes([{
    nome: "Maria",
    telefone: "987654321",
    email: "maria@example.com",
    dataNascimento: "1985-04-12"
}]);
console.log("Pacientes atualizados:", secretaria.getPacientes());