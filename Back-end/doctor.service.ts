import { Database } from './database';

export class DoctorService {
  private static _databaseInstance: Database;

  // Getter para inicializar e acessar a instância do Database
  static get databaseInstance(): Database {
    if (!this._databaseInstance) {
      this._databaseInstance = new Database();
    }
    return this._databaseInstance;
  }

  // Setter caso precise atualizar a instância do Database (se necessário)
  static set databaseInstance(database: Database) {
    this._databaseInstance = database;
  }

  static async appoitmentView(): Promise<any[]> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      const result = await Database.query("SELECT * FROM patient_appointments_view");
      return result;
    } catch (error) {
      console.error('Error listing appointments:', error);
      throw new Error('Failed to list appointments. Please try again later.');
    }
  }

  static async addDoctor(
    name: string,
    phone: string,
    email: string,
    speciality: string
  ): Promise<void> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
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
      await Database.init(); // Alterado para chamar o método estático diretamente
      const currentDate = new Date();
      const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
      const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
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
      await Database.init(); // Alterado para chamar o método estático diretamente
      await Database.query(
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
        [patient_id, doctor_id, date, time, reason, status]
      );
    } catch (error) {
      console.error('Error recording schedule:', error);
      throw new Error('Failed to record schedule. Please check the input data and try again.');
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
      await Database.init(); // Alterado para chamar o método estático diretamente
      await Database.query(
        'INSERT INTO receitas_medicas (id_paciente, id_medico, data_prescricao, observacoes) VALUES (?, ?, ?, ?)',
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
}