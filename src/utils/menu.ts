import readlineSync from 'readline-sync';
// src/utils/menu.ts
import { inserirPaciente, agendarConsulta, exibirRelatorios } from './relatorios'; // Verifique se o caminho está correto

export { inserirPaciente, agendarConsulta, exibirRelatorios }; // Exporte as funções para que possam ser usadas em outros arquivos.

export const menu = () => {
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