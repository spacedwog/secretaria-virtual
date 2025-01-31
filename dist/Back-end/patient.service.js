import { Database } from './database.ts';
export class PatientService {
    static async listPatients() {
        try {
            await Database.init(); // Certifique-se de inicializar a conexão
            const result = await Database.query("SELECT * FROM patients");
            return result; // O MySQL retornará os dados no formato esperado
        }
        catch (error) {
            console.error('Error listing patients:', error);
            throw new Error('Failed to list patients. Please try again later.');
        }
    }
    static async addPatient(name, age, phone, email, address) {
        try {
            Database.init(); // Certifique-se de inicializar a conexão
            await Database.query('CALL add_patient(?, ?, ?, ?, ?)', [name, age, phone, email, address]);
        }
        catch (error) {
            console.error('Error adding patient:', error);
            throw new Error('Failed to add patient. Please check the input data and try again.');
        }
    }
    static async editPatient(patientId, fieldsToUpdate) {
        try {
            const columns = Object.keys(fieldsToUpdate);
            const values = Object.values(fieldsToUpdate);
            if (columns.length === 0) {
                throw new Error('No fields provided for update.');
            }
            const setClause = columns.map((col) => `${col} = ?`).join(', ');
            const query = `UPDATE patients SET ${setClause} WHERE patient_id = ?`;
            console.log('Executing query:', query);
            await Database.query(query, [...values, patientId]);
        }
        catch (error) {
            console.error('Error editing patient:', error);
            throw new Error('Failed to edit patient. Please check the input data and try again.');
        }
    }
    static async deletePatient(patientId) {
        try {
            await Database.query('DELETE FROM patients WHERE patient_id = ?', [patientId]);
        }
        catch (error) {
            console.error('Error deleting patient:', error);
            throw new Error('Failed to delete patient. Please try again later.');
        }
    }
}
