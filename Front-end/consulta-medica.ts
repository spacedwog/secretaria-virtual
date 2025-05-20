import * as readlineSync from 'readline-sync';
import { DoctorService } from '../Back-end/doctor.service.ts';

export class MenuSchedule {
  public async menuConsultaMedica() {
    let option: string;

    do {
      console.log('\n--- Painel de Consulta Médica ---');
      console.log('1. Listar Consultas');
      console.log('2. Adicionar Doutor');
      console.log('3. Registrar Visita');
      console.log('4. Agendar Consulta');
      console.log('v. Voltar');

      option = readlineSync.question('Escolha uma opção: ');

      switch (option) {
        case '1':
          await this.listAppointments();
          break;
        case '2':
          await this.addDoctor();
          break;
        case '3':
          await this.registerVisit();
          break;
        case '4':
          await this.scheduleAppointment();
          break;
        case 'v':
          console.log('Voltando ao menu principal...');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (option !== 'v');
  }

  // Listar todas as consultas
  private async listAppointments() {
    try {
      const appointments = await DoctorService.appointmentView();
      console.log('\n--- Lista de Consultas Médicas ---');
      appointments.forEach((appointment) => {
        console.table([
          {
            Paciente: appointment.patient_name,
            Doutor: appointment.doctor_name,
            Data: new Date(appointment.appointment_date).toLocaleDateString(),
            Hora: appointment.appointment_time,
            Status: appointment.status,
          },
        ]);
      });
    } catch (err) {
      console.error('Erro ao listar consultas médicas:', err);
    }
  }

  // Adicionar um novo doutor
  private async addDoctor() {
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

  // Registrar visita
  private async registerVisit() {
    try {
      const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
      const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);

      await DoctorService.visitDoctor(patientId, doctorId);
      console.log('Visita registrada com sucesso!');
    } catch (err) {
      console.error('Erro ao registrar visita:', err);
    }
  }

  // Agendar consulta
  private async scheduleAppointment() {
    try {
      const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
      const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
      const title = readlineSync.question('Nome da consulta médica: ');
      const appointmentDate = readlineSync.question('Data da consulta (AAAA-MM-DD): ');
      const appointmentTime = readlineSync.question('Horário da consulta (HH:MM): ');
      const reason = readlineSync.question('Motivo da consulta: ');
      const status = readlineSync.question('Status (agendado/realizado): ');

      await DoctorService.scheduleAppointment(patientId, doctorId, appointmentDate, appointmentTime, reason, status, title);
      console.log('Consulta agendada com sucesso!');
    } catch (err) {
      console.error('Erro ao agendar consulta:', err);
    }
  }
}