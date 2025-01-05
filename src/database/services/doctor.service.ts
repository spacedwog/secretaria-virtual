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
      await Database.query(
        'INSERT INTO patients_doctors (patient_id, doctor_id) VALUES (?, ?)',
        [patientId, doctorId]
      );
    } catch (error) {
      console.error('Error visiting doctor:', error);
      throw new Error('Failed to visit doctor. Please check the input data and try again.');
    }
  }

  static async consultSchedule(patientId: number): Promise<any[]> {
    try {
      await Database.init(); // Certifique-se de inicializar a conexão
      const result = await Database.query('SELECT * FROM patient_appointments_view WHERE patient_id = ?', [patientId]);
      return result;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient. Please try again later.');
    }
  }

}