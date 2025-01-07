import readlineSync from 'readline-sync';
import { MenuPacient } from './menu-paciente';
import { MedicSchedule } from './consulta-medica';

class MenuStarter{
  public async menuPrincipal(){
    let option: string;

    do {
      console.log('\n--- Sistema de Secretaria Virtual ---');
      console.log('1. Menu Paciente');
      console.log('2. Menu Consulta Médica');
      console.log('5. Sair');

      const paciente = new MenuPacient();
      const medico = new MedicSchedule();

      option = readlineSync.question('Escolha uma opcao: ');

      switch (option) {
        case '1':
          await paciente.menuPaciente();
          break;
        case '2':
          await medico.consultaMedica();
          break;
        case '5':
          console.log('Saindo do sistema...');
          break;
        default:
          console.log('Opcao invalida. Tente novamente.');
      }
    } while (option !== '5');
  }
}

// Ponto de entrada da aplicação
(async () => {
  const menu = new MenuStarter();
  try {
    console.log('Iniciando sistema de secretaria virtual...');
    await menu.menuPrincipal();
    console.log('Sistema encerrado.');
  } catch (err) {
    console.error('Erro fatal na aplicação:', err);
  }
})();