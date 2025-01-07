import readlineSync from 'readline-sync';
import { MenuPacient } from './menu-paciente';
import { MenuSchedule } from './consulta-medica';

class MenuStarter{
  public async menuPrincipal(){
    let option: string;

    do {
      console.log('\n--- Sistema de Secretaria Virtual ---');
      console.log('1. Menu Paciente');
      console.log('2. Menu Consulta Médica');
      console.log('5. Sair');

      option = readlineSync.question('Escolha uma opcao: ');

      switch (option) {
        case '1':
          await this.menuPaciente();
          break;
        case '2':
          await this.menuConsultaMedica();
          break;
        case '5':
          console.log('Saindo do sistema...');
          break;
        default:
          console.log('Opcao invalida. Escolha entre 1, 2 ou 5.');
      }
    } while (option !== '5');
  }

  private async menuPaciente() {
    try{
      const paciente = new MenuPacient();
      await paciente.menuPaciente();
    }
    catch (err) {
      console.error('Erro ao executar o menu paciente:', err);
    }
  }

  private async menuConsultaMedica() {
    try{
      const medico = new MenuSchedule();
      await medico.consultaMedica();
    }
    catch (err) {
      console.error('Erro ao executar o menu consulta médica:', err);
    }
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