import { query } from '../database';
import { Patient } from '../models/patient.models';

export async function getAllPatients(): Promise<Patient[]> {
  const patients = await query('SELECT * FROM patients');
  return patients;
}

export async function createPatient(patient: Patient): Promise<Patient> {
  const result = await query(
    'INSERT INTO patients (name, age, phone, email, appointment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [patient.name, patient.age, patient.phone, patient.email, patient.appointmentDate]
  );
  return result[0];
}