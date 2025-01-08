import { Database } from '../database';

export class DoctorService {
  static async appoitmentView(): Promise<any[]> {
    try {
      await Database.init(); // Certifique-se de inicializar a conexão
      const result = await Database.query("SELECT * FROM patient_appointments_view");
      return result;  // O MySQL retornará os dados no formato esperado
    } catch (error) {
      console.error('Error listing appoitments:', error);
      throw new Error('Failed to list appoitments. Please try again later.');
    }
  }

  static async addDoctor(
    name: string,
    phone: string,
    email: string,
    speciality: string
  ): Promise<void> {
    try {
      await Database.init(); // Certifique-se de inicializar a conexão
      await Database.query(
        'INSERT INTO doctors (name, phone, email, speciality) VALUES (?, ?, ?, ?)',
        [name, phone, email, speciality]
      );
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw new Error('Failed to add doctor. Please check the input data and try again.');
    }
  }

  static async visitDoctor(
    patientId: number,
    doctorId: number
  ): Promise<void> {
    try {
      await Database.init(); // Certifique-se de inicializar a conexão
      const ano = new Date().getFullYear();
      const mes = new Date().getMonth();
      const dia = new Date().getDay();
      const date = ano + '-' + mes + '-' + dia;
      const time = new Date().getHours() + ':' + new Date().getMinutes();
      await Database.query(
        'INSERT INTO patients_doctors (patient_id, doctor_id, visit_date, visit_time) VALUES (?, ?, ?, ?)',
        [patientId, doctorId, date, time]
      );
    } catch (error) {
      console.error('Error visiting doctor:', error);
      throw new Error('Failed to visit doctor. Please check the input data and try again.');
    }
  }

  static async recordSchedule(
    patient_id: number,
    doctor_id: number,
    date: string,
    time: string,
    reason: string,
    status: string
  ): Promise<void> {
    try {
      await Database.init(); // Certifique-se de inicializar a conexão
      await Database.query(
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
        [patient_id, doctor_id, date, time, reason, status]
      );
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw new Error('Failed to add doctor. Please check the input data and try again.');
    }
  }

  static async medicRecip(
    id_paciente: number,
    id_medico: number,
    id_receita: number,
    data_prescricao: string,
    observacao: string,
    nome_medicamento: string,
    frequencia: string,
    dosagem: string,
    duracao: string
  ): Promise<void> {
    try {
      await Database.init(); // Certifique-se de inicializar a conexão
      await Database.query(
        'INSERT INTO receitas_medicas (id_paciente, id_medico, data_prescricao, observacao) VALUES (?, ?, ?, ?)',
        [id_paciente, id_medico, data_prescricao, observacao]
      );
      await Database.query(
        'INSERT INTO medicamentos_receita (id_receita, nome_medicamento, dosagem, frequencia, duracao) VALUES (?, ?, ?, ?, ?)',
        [id_receita, nome_medicamento, dosagem, frequencia, duracao]
      );
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new Error('Failed to add medication. Please check the input data and try again.');
    }
}