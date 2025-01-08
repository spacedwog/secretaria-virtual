import readlineSync from 'readline-sync';
import { MenuPacient } from './pacient/menu-paciente';
import { MenuSchedule } from './schedule/consulta-medica';
import { DoctorService } from './database/services/doctor.service';

class MenuStarter {
  // Método principal do menu
  public async menuPrincipal() {
    let option: string;

    do {
      console.log('\n--- Sistema de Secretaria Virtual ---');
      console.log('1. Menu Paciente');
      console.log('2. Menu Consulta Médica');
      console.log('3. Receita Médica');
      console.log('4. Imprimir Receita Médica');
      console.log('5. Sair');

      // Captura a escolha do usuário
      option = readlineSync.question('Escolha uma opcao: ');

      // Executa a funcionalidade correspondente
      switch (option) {
        case '1':
          await this.menuPaciente();
          break;
        case '2':
          await this.menuConsultaMedica();
          break;
        case '3':
          await this.receitaMedica();
          break;
        case '4':
          await this.imprimirReceitaMedica();
          break;
        case '5':
          console.log('Saindo do sistema...');
          break;
        default:
          console.log('Opcao invalida. Escolha entre 1, 2 ou 5.');
      }
    } while (option !== '5');

    console.log('Obrigado por usar o sistema. Até a próxima!');
  }

  // Método para acessar o menu do paciente
  private async menuPaciente() {
    try {
      const paciente = new MenuPacient();
      await paciente.menuPaciente();
    } catch (err) {
      console.error('Erro ao executar o menu paciente:', err);
    }
  }

  // Método para acessar o menu de consulta médica
  private async menuConsultaMedica() {
    try {
      const medico = new MenuSchedule();
      await medico.consultaMedica();
    } catch (err) {
      console.error('Erro ao executar o menu consulta médica:', err);
    }
  }
  
  // Registrar visita
  private async receitaMedica() {
    try {
      const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
      const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
      const recipId = parseInt(readlineSync.question('ID do medicamento: '), 10);
      const recipName = readlineSync.question('Nome do medicamento: ');
      const dataMed = readlineSync.question('Data da medicação (aaaa/mm/dd): ');
      const recipQuantity = readlineSync.question('Dosagem da medicação: ');
      const frequencyMed = readlineSync.question('Frequência de medicação: ');
      const consumation = readlineSync.question('Duracao da dose: ');
      const observation = readlineSync.question('Observações: ');

      await DoctorService.medicRecip(
        patientId,
        doctorId,
        recipId,
        dataMed,
        observation,
        recipName,
        frequencyMed,
        recipQuantity,
        consumation);
      console.log('Medicamento registrado com sucesso!');
    }
    catch (err) {
        console.error('Erro ao registrar visita:', err);
    }
  }

  private async imprimirReceitaMedica() {
    const recipId = parseInt(readlineSync.question('ID do medicamento: '), 10);
  }
}

// Ponto de entrada da aplicação
(async () => {
  const menu = new MenuStarter();
  try {
    console.log('Iniciando sistema de secretaria virtual...');
    await menu.menuPrincipal();
    console.log('Sistema encerrado com sucesso.');
  } catch (err) {
    console.error('Erro fatal na aplicação:', err);
  }
})();