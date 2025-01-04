"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relatorios_1 = require("./relatorios"); // Importa as funções de relatório
class SecretariaVirtual {
    constructor() {
        this.pacientes = []; // Lista de pacientes
        this.consultas = []; // Lista de consultas
        // Getter e Setter para nome do paciente
        this.nome = '';
        // Getter e Setter para telefone do paciente
        this.telefone = '';
        // Getter e Setter para email do paciente
        this.email = '';
        // Getter e Setter para data de nascimento do paciente
        this.dataNascimento = '';
        // Getter e Setter para ID do paciente
        this.pacienteId = 0;
        // Getter e Setter para data da consulta
        this.dataConsulta = '';
    }
    // Getters e Setters para pacientes
    getPacientes() {
        return this.pacientes;
    }
    setPacientes(pacientes) {
        this.pacientes = pacientes;
    }
    // Getters e Setters para consultas
    getConsultas() {
        return this.consultas;
    }
    setConsultas(consultas) {
        this.consultas = consultas;
    }
    getNome() {
        return this.nome;
    }
    setNome(nome) {
        this.nome = nome;
    }
    getTelefone() {
        return this.telefone;
    }
    setTelefone(telefone) {
        this.telefone = telefone;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getDataNascimento() {
        return this.dataNascimento;
    }
    setDataNascimento(dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    getPacienteId() {
        return this.pacienteId;
    }
    setPacienteId(pacienteId) {
        this.pacienteId = pacienteId;
    }
    getDataConsulta() {
        return this.dataConsulta;
    }
    setDataConsulta(dataConsulta) {
        this.dataConsulta = dataConsulta;
    }
    // Função para inserir paciente (exemplo básico)
    inserirPaciente() {
        console.log(`Inserindo paciente: ${this.getNome()}`);
        // Lógica para inserir paciente no banco de dados (simulação)
        const paciente = {
            nome: this.getNome(),
            telefone: this.getTelefone(),
            email: this.getEmail(),
            dataNascimento: this.getDataNascimento(),
        };
        this.pacientes.push(paciente); // Adicionando o paciente à lista
        console.log(`Paciente ${this.getNome()} inserido com sucesso!`);
    }
    // Função para agendar consulta (exemplo básico)
    agendarConsulta() {
        console.log(`Agendando consulta para o paciente ID: ${this.getPacienteId()} na data ${this.getDataConsulta()}`);
        // Lógica para agendar consulta no banco de dados (simulação)
        const consulta = {
            pacienteId: this.getPacienteId(),
            dataConsulta: this.getDataConsulta(),
        };
        this.consultas.push(consulta); // Adicionando a consulta à lista
        console.log(`Consulta agendada com sucesso para o paciente ${this.getPacienteId()}`);
    }
    // Função para exibir relatórios (chama as funções de gerar relatório)
    exibirRelatorios() {
        console.log('Exibindo relatórios...');
        (0, relatorios_1.gerarRelatorioJSON)();
        (0, relatorios_1.gerarRelatorioHTML)();
        (0, relatorios_1.gerarRelatorioPDF)();
    }
    // Menu principal da aplicação (interação com o usuário)
    exibirMenu() {
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
