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
        'CALL add_doctor(?, ?, ?, ?)',
        [name, speciality, phone, email]
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
        'CALL visit_doctor(?, ?, ?, ?)',
        [date, time, patientId, doctorId]
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
        'CALL make_appointment(?, ?, ?, ?, ?, ?)',
        [date, time, reason, status, patient_id, doctor_id]
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
        'CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id_paciente, id_medico, data_prescricao, observacao, id_receita, nome_medicamento, dosagem, frequencia, duracao]
      );
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new Error('Failed to add medication. Please check the input data and try again.');
    }
  }

  static async printMedicRecip(id_receita: number): Promise<any[]> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      const result = await Database.query('SELECT * FROM vw_receitas_detalhadas WHERE id_receita = ?',
        [id_receita]
      );
      return result;
    } catch (error) {
      console.error('Error printing medication:', error);
      throw new Error('Failed to print medication. Please check the input data and try again.');
    }
  }
}