import { MenuOptions } from './ui/interface';
import { displayMenu } from './ui/menu';
import * as readlineSync from 'readline-sync';

const menuOptions: MenuOptions = {
  viewPatients: 'View Patients',
  addPatient: 'Add Patient',
  generateReport: 'Generate Report',
  exit: 'Exit',
};

async function main() {
  let choice: string;

  do {
    displayMenu(menuOptions);
    choice = readlineSync.question('Choose an option: ');

    switch (choice) {
      case '1':
        // Exibir pacientes
        break;
      case '2':
        // Adicionar paciente
        break;
      case '3':
        // Gerar relatório
        break;
      case '4':
        console.log('Exiting...');
        break;
      default:
        console.log('Invalid option. Try again.');
    }
  } while (choice !== '4');
}

main();