import { exec } from 'child_process';
import * as readlineSync from 'readline-sync';
import { MenuPacient } from './menu-paciente';
import { MenuSchedule } from './consulta-medica';
import { DoctorService } from '../Back-end/doctor.service';

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
      const codeMedicamento = readlineSync.question('Codigo do medicamento: ');
      const recipId = parseInt(readlineSync.question('ID do medicamento: '), 10);
      const recipName = readlineSync.question('Nome do medicamento: ');
      const tipoMedicamento = readlineSync.question('Tipo do medicamento: ');
      const dataMed = readlineSync.question('Data da medicacao (aaaa/mm/dd): ');
      const recipQuantity = readlineSync.question('Dosagem da medicacao: ');
      const frequencyMed = readlineSync.question('Frequência de medicacao: ');
      const consumation = readlineSync.question('Duracao da dose: ');
      const observation = readlineSync.question('Observacoes: ');

      await DoctorService.medicRecip(
        patientId,
        doctorId,
        codeMedicamento,
        recipId,
        dataMed,
        observation,
        recipName,
        tipoMedicamento,
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

    const receitas = await DoctorService.printMedicRecip(recipId);
    console.log('\n--- Lista de Receitas Médicas ---');

    receitas.forEach((receitas) => {
      const date = new Date(receitas.data_prescricao).toDateString();
      const dosagem = receitas.dosagem;
      const frequencia = receitas.frequencia;
      const duracao = receitas.duracao;
      const observacao = receitas.observacoes;

      console.table([
        {
          Medicamento: receitas.nome_medicamento,
          Dosagem: dosagem,
          Frequencia: frequencia,
          Duracao: duracao,
          Observacao: observacao,
          Data: date
        }
      ]);
    });
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