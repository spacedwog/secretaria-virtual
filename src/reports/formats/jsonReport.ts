import * as fs from 'fs';
import { Patient } from '../../database/models/patient.models';

export function generateJSONReport(patients: Patient[]): string {
  const fileName = 'report.json';
  const jsonData = JSON.stringify(patients, null, 2);
  fs.writeFileSync(fileName, jsonData, 'utf-8');
  console.log(`JSON report saved as ${fileName}`);
  return fileName;
}