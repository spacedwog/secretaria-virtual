import { Patient } from '../database/models/patient.model';
import { generateJSONReport } from './formats/jsonReport';
import { generateHTMLReport } from './formats/htmlReport';
import { generatePDFReport } from './formats/pdfReport';

export function generateReport(patients: Patient[], format: string) {
  switch (format) {
    case 'json':
      return generateJSONReport(patients);
    case 'html':
      return generateHTMLReport(patients);
    case 'pdf':
      return generatePDFReport(patients);
    default:
      throw new Error('Invalid report format');
  }
}