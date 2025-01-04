// Definindo interfaces para a interação com o usuário e estrutura dos dados.

export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  appointmentDate: string;
}

// Interface para os dados de relatório, que pode ser usada para exibir relatórios de pacientes.
export interface Report {
  title: string;
  patients: Patient[];
}

// Interface para as opções de menu que o usuário pode escolher.
export interface MenuOptions {
  viewPatients: string;
  addPatient: string;
  generateReport: string;
  exit: string;
}