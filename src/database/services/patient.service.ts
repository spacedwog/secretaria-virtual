import { Database } from '../database';

export class PatientService {
  static async listPatients(): Promise<any[]> {
    return await Database.query('SELECT * FROM patients');
  }

  static async addPatient(
    name: string,
    age: number,
    phone: string,
    email: string,
    address: string
  ): Promise<void> {
    await Database.query(
      'INSERT INTO patients (name, age, phone, email, address) VALUES ($1, $2, $3, $4, $5)',
      [name, age, phone, email, address]
    );
  }

  static async editPatient(
    patientId: number,
    fieldsToUpdate: Record<string, any>
  ): Promise<void> {
    const columns = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);

    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
    const query = `UPDATE patients SET ${setClause} WHERE patient_id = $${columns.length + 1}`;
    await Database.query(query, [...values, patientId]);
  }

  static async deletePatient(patientId: number): Promise<void> {
    await Database.query('DELETE FROM patients WHERE patient_id = $1', [patientId]);
  }
}