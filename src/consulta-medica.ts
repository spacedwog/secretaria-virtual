import readlineSync from 'readline-sync';
import { Database } from './database/database';
import { DoctorService } from './database/services/doctor.service';

// Função para exibir o menu principal
async function showMenu() {
  let option: string;

  do {
    console.log('\n--- Sistema de Secretaria Virtual ---');
    console.log('1. Listar Consultas');
    console.log('2. Adicionar Doutor');
    console.log('3. Registrar Visita');
    console.log('4. Agendar Consulta');
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
          await makeAppointment();
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
    const phone = readlineSync.question('Telefone: ');
    const email = readlineSync.question('Email: ');
    const speciality = readlineSync.question('Especialidade: ');

    await DoctorService.addDoctor(name, phone, email, speciality);
    console.log('Doutor adicionado com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar doutor:', err);
  }
}

// Editar um paciente existente
async function registerVisit() {
  try {

    const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
    const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);

    await DoctorService.visitDoctor(patientId, doctorId);

  } catch (err) {
    console.error('Erro ao editar paciente:', err);
  }
}

async function makeAppointment() {
  try {
    
    const appoitmentDate = readlineSync.question('Data da consulta: ');
    const appoitmentTime = readlineSync.question('Horário da consulta: ');
    const reasonAppoiment = readlineSync.question('Motivo da consulta: ');
    const statusAppoiment = readlineSync.question('Status da consulta: ');

    await DoctorService.makeAppoitment(appoitmentDate, appoitmentTime, reasonAppoiment, statusAppoiment);
    console.log('Consulta agendada com sucesso!');
  } catch (err) {
    console.error('Erro ao agendar consulta:', err);
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