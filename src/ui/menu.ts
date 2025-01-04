import { MenuOptions } from './interface';

export function displayMenu(options: MenuOptions) {
  console.log('1. ' + options.viewPatients);
  console.log('2. ' + options.addPatient);
  console.log('3. ' + options.generateReport);
  console.log('4. ' + options.exit);
}