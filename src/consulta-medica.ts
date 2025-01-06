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
        await recordSchedule();
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
      const date = new Date(appoitment.appointment_date);
      const d = new Date(appoitment.appointment_time);
      const time = d.getTime();
      console.log(`O paciente ${appoitment.patient_name} têm consulta médica com o doutor ${appoitment.doctor_name} no dia ${date} às ${time}`);
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
    console.log('Visita ao consultório médico registrada com sucesso!');
  } catch (err) {
    console.error('Erro ao editar paciente:', err);
  }
}

// Editar um paciente existente
async function recordSchedule() {
  try {

    const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
    const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
    const appoitmentDate = readlineSync.question('Data da consulta (aaaa/mm/dd): ');
    const appoitmentTime = readlineSync.question('Horário da consulta (hh:mm): ');
    const reason = readlineSync.question('Motivo da consulta: ');
    const status = readlineSync.question('Status da consulta (agendado/realizado): ');

    await DoctorService.recordSchedule(patientId, doctorId, appoitmentDate, appoitmentTime, reason, status);
    console.log('Consulta agendada com sucesso!');
  }
  catch (err) {
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