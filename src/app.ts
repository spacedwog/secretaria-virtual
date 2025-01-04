import readlineSync from 'readline-sync';
// src/app.ts
// Remova a extensão .ts ao importar módulos.
import { inserirPaciente, agendarConsulta, exibirRelatorios } from './utils/menu';

const menu = () => {
    const opcao = readlineSync.question(`
    1. Inserir paciente
    2. Agendar consulta
    3. Exibir relatórios
    4. Sair
    Selecione uma opção: `);

    switch (opcao) {
        case '1':
            inserirPaciente();
            break;
        case '2':
            agendarConsulta();
            break;
        case '3':
            exibirRelatorios();
            break;
        case '4':
            console.log('Saindo...');
            process.exit();
            break;
        default:
            console.log('Opção inválida!');
            menu();
    }
};

menu();