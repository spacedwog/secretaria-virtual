import { gerarRelatorioJSON, gerarRelatorioHTML, gerarRelatorioPDF } from './relatorios'; // Importa as funções de relatório

// Função para inserir paciente (exemplo básico)
export const inserirPaciente = (nome: string, telefone: string, email: string, dataNascimento: string) => {
    console.log(`Inserindo paciente: ${nome}`);
    // Lógica para inserir paciente no banco de dados
    // Exemplo de query para inserir no banco (ajustar conforme sua estrutura)
    const query = `INSERT INTO pacientes (nome, telefone, email, data_nascimento) VALUES (?, ?, ?, ?)`;
    connection.query(query, [nome, telefone, email, dataNascimento], (err, result) => {
        if (err) {
            console.error('Erro ao inserir paciente:', err);
        } else {
            console.log(`Paciente ${nome} inserido com sucesso!`);
        }
    });
};

// Função para agendar consulta (exemplo básico)
export const agendarConsulta = (pacienteId: number, dataConsulta: string) => {
    console.log(`Agendando consulta para o paciente ID: ${pacienteId} na data ${dataConsulta}`);
    // Lógica para agendar consulta no banco de dados
    // Exemplo de query para agendar a consulta (ajustar conforme sua estrutura)
    const query = `INSERT INTO consultas (paciente_id, data_consulta) VALUES (?, ?)`;
    connection.query(query, [pacienteId, dataConsulta], (err, result) => {
        if (err) {
            console.error('Erro ao agendar consulta:', err);
        } else {
            console.log(`Consulta agendada com sucesso para o paciente ${pacienteId}`);
        }
    });
};

// Função para exibir relatórios (chama as funções de gerar relatório)
export const exibirRelatorios = () => {
    console.log('Exibindo relatórios...');
    gerarRelatorioJSON();
    gerarRelatorioHTML();
    gerarRelatorioPDF();
};

// Menu principal da aplicação
export const menu = () => {
    console.log('Bem-vindo ao Sistema de Secretária Virtual!');
    console.log('1. Inserir Paciente');
    console.log('2. Agendar Consulta');
    console.log('3. Exibir Relatórios');
    console.log('4. Sair');
    
    // Lógica para capturar a escolha do usuário
    const prompt = require('prompt-sync')();
    const escolha = prompt('Escolha uma opção: ');

    switch (escolha) {
        case '1':
            const nome = prompt('Nome do Paciente: ');
            const telefone = prompt('Telefone: ');
            const email = prompt('Email: ');
            const dataNascimento = prompt('Data de Nascimento (YYYY-MM-DD): ');
            inserirPaciente(nome, telefone, email, dataNascimento);
            break;
        case '2':
            const pacienteId = parseInt(prompt('ID do Paciente: '), 10);
            const dataConsulta = prompt('Data da Consulta (YYYY-MM-DD): ');
            agendarConsulta(pacienteId, dataConsulta);
            break;
        case '3':
            exibirRelatorios();
            break;
        case '4':
            console.log('Saindo...');
            process.exit();
            break;
        default:
            console.log('Opção inválida. Tente novamente.');
            menu();
            break;
    }
};