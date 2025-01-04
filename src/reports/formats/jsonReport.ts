import { Patient } from '../../database/models/patient.model';
import * as fs from 'fs';

export function generateJSONReport(patients: Patient[]): string {
  const report = JSON.stringify(patients, null, 2);
  fs.writeFileSync('patients_report.json', report);
  return 'JSON report generated successfully';
}