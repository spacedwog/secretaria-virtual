import readlineSync from 'readline-sync';
import { Database } from './database/database';
import { DoctorService } from './database/services/doctor.service';
import { PatientService } from './database/services/patient.service';

// Função para exibir o menu principal
async function menuSchedule() {
  let option: string;

  do {
    console.log('\n--- Sistema de Secretaria Virtual 2---');
    console.log('1. Cadastrar Doutor');
    console.log('2. Agendar Visita Médica');
    console.log('3. Agendar Consulta');
    console.log('4. Sair');

    option = readlineSync.question('Escolha uma opcao: ');

    switch (option) {
      case '1':
        await addDoctor();
        break;
      case '2':
        await addVisit();
        break;
      case '3':
        await scheduleAppoiment();
        break;
      case '4':
        console.log('Saindo do sistema...');
        break;
      default:
        console.log('Opcao invalida. Tente novamente.');
    }
  } while (option !== '5');

  Database.close(); // Fecha a conexão ao sair
}

// Adicionar um novo paciente
async function addDoctor() {
  try {
    const name = readlineSync.question('Nome do doutor: ');
    const email = readlineSync.question('Email: ');
    const phone = readlineSync.question('Telefone: ');
    const speciality = readlineSync.question('Especialidade: ');

    await DoctorService.addDoctor(name, phone, email, speciality);
    console.log('Doutor adicionado com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar paciente:', err);
  }
}

// Editar um paciente existente
async function addVisit() {
  try {
    const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
    const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);

    await DoctorService.visitDoctor(patientId, doctorId);
    console.log('Visita cadastrada com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar paciente:', err);
  }
}

async function scheduleAppoiment() {
  try {
    const appoitmentDate = readlineSync.question('Data da consulta: ');
    const appoitmentTime = readlineSync.question('Horário da consulta: ');
    const reasonAppoiment = readlineSync.question('Motivo da consulta: ');
    const statusAppoiment = readlineSync.question('Status da consulta: ');

    await DoctorService.makeAppoitment(appoitmentDate, appoitmentTime, reasonAppoiment, statusAppoiment);
    console.log('Consulta agendada com sucesso!');

  } catch (err) {
    console.error('Erro ao adicionar consulta médica:', err);
  }
}

// Ponto de entrada da aplicação
(async () => {
  try {
    console.log('Iniciando sistema de consulta médica...');
    await menuSchedule();
    console.log('Sistema encerrado.');
  }
  catch (err) {
    console.error('Erro fatal na aplicação:', err);
    Database.close(); // Garante que a conexão será encerrada em caso de erro
  }
})();