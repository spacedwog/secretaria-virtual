import readlineSync from 'readline-sync';
import { PatientService } from '../database/services/patient.service';
import { Database } from '../database/database';
import { generateReport } from '../reports/reportGenerator';

// Função para exibir o menu principal
async function showMenu() {
  let option: string;

  do {
    console.log('\n--- Menu Principal ---');
    console.log('1. Listar Pacientes');
    console.log('2. Adicionar Paciente');
    console.log('3. Editar Paciente');
    console.log('4. Excluir Paciente');
    console.log('5. Sair');

    option = readlineSync.question('Escolha uma opcao: ');

    switch (option) {
      case '1':
        await listPatients();
        break;
      case '2':
        await addPatient();
        break;
      case '3':
        await editPatient();
        break;
      case '4':
        await deletePatient();
        break;
      case '5':
        console.log('Saindo do sistema...');
        break;
      default:
        console.log('Opcao invalida. Tente novamente.');
    }
  } while (option !== '5');

  await Database.close(); // Fecha a conexão ao sair
}

// Listar todos os pacientes
async function listPatients() {
  try {
    const patients = await PatientService.listPatients();
    console.log('\n--- Lista de Pacientes ---');
    patients.forEach((patient) => {
      console.log(`ID: ${patient.patient_id}, Nome: ${patient.name}, Idade: ${patient.age}, Telefone: ${patient.phone}`);
    });
  } catch (err) {
    console.error('Erro ao listar pacientes:', err);
  }
}

// Adicionar um novo paciente
async function addPatient() {
  try {
    const name = readlineSync.question('Nome do paciente: ');
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
async function editPatient() {
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
async function deletePatient() {
  try {
    const patientId = parseInt(readlineSync.question('ID do paciente a ser excluido: '), 10);
    await PatientService.deletePatient(patientId);
    console.log('Paciente excluido com sucesso!');
  } catch (err) {
    console.error('Erro ao excluir paciente:', err);
  }
}

// Inicia o menu principal
showMenu()
  .then(() => console.log('Programa encerrado.'))
  .catch((err) => console.error('Erro inesperado:', err));