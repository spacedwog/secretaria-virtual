import readlineSync from 'readline-sync';
import { Database } from './database/database';
import { PatientService } from './database/services/patient.service';
import { register } from 'module';
import { DoctorService } from './database/services/doctor.service';

// Função para exibir o menu principal
async function showMenu() {
  let option: string;

  do {
    console.log('\n--- Sistema de Secretaria Virtual ---');
    console.log('1. Listar Consultas');
    console.log('2. Adicionar Doutor');
    console.log('3. Registrar Visita');
    console.log('4. Consultar Agendamento');
    console.log('5. Sair');

    option = readlineSync.question('Escolha uma opcao: ');

    switch (option) {
      case '1':
        await listAppoitment();
        break;
      case '2':
        await addDoctor();
        break;
      case '3':
        await registerVisit();
        break;
      case '4':
        await consultSchedule();
        break;
      case '5':
        console.log('Saindo do sistema...');
        break;
      default:
        console.log('Opcao invalida. Tente novamente.');
    }
  } while (option !== '5');

  Database.close(); // Fecha a conexão ao sair
}

// Listar todos os pacientes
async function listAppoitment() {
  try {
    const appoitment = await DoctorService.appoitmentView();
    console.log('\n--- Lista de Consultas Médicas ---');
    appoitment.forEach((appoitment) => {
      console.log(`ID: ${appoitment.patient_id}, Nome: ${appoitment.patient_name}, Idade: ${appoitment.age}, Telefone: ${appoitment.phone}`);
    });
  } catch (err) {
    console.error('Erro ao listar consultas médicas:', err);
  }
}

// Adicionar um novo paciente
async function addDoctor() {
  try {
    const name = readlineSync.question('Nome do doutor: ');
    const age = parseInt(readlineSync.question('Idade: '), 10);
    const phone = readlineSync.question('Telefone: ');
    const email = readlineSync.question('Email: ');
    const address = readlineSync.question('Endereco: ');

    await PatientService.addPatient(name, age, phone, email, address);
    console.log('Paciente adicionado com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar paciente:', err);
  }
}

// Editar um paciente existente
async function registerVisit() {
  try {
    const patientId = parseInt(readlineSync.question('ID do paciente a ser editado: '), 10);
    const fieldsToUpdate: Record<string, any> = {};

    const name = readlineSync.question('Novo nome (deixe vazio para nao alterar): ');
    if (name) fieldsToUpdate.name = name;

    const age = readlineSync.question('Nova idade (deixe vazio para nao alterar): ');
    if (age) fieldsToUpdate.age = parseInt(age, 10);

    const phone = readlineSync.question('Novo telefone (deixe vazio para nao alterar): ');
    if (phone) fieldsToUpdate.phone = phone;

    const email = readlineSync.question('Novo email (deixe vazio para nao alterar): ');
    if (email) fieldsToUpdate.email = email;

    const address = readlineSync.question('Novo endereco (deixe vazio para nao alterar): ');
    if (address) fieldsToUpdate.address = address;

    if (Object.keys(fieldsToUpdate).length > 0) {
      await PatientService.editPatient(patientId, fieldsToUpdate);
      console.log('Paciente atualizado com sucesso!');
    } else {
      console.log('Nenhuma alteracao foi feita.');
    }
  } catch (err) {
    console.error('Erro ao editar paciente:', err);
  }
}

// Excluir um paciente
async function consultSchedule() {
  try {
    const patientId = parseInt(readlineSync.question('ID do paciente a ser excluido: '), 10);
    await PatientService.deletePatient(patientId);
    console.log('Paciente excluido com sucesso!');
  } catch (err) {
    console.error('Erro ao excluir paciente:', err);
  }
}

// Ponto de entrada da aplicação
(async () => {
  try {
    console.log('Iniciando sistema de secretaria virtual...');
    await showMenu();
    console.log('Sistema encerrado.');
  }
  catch (err) {
    console.error('Erro fatal na aplicação:', err);
    Database.close(); // Garante que a conexão será encerrada em caso de erro
  }
})();