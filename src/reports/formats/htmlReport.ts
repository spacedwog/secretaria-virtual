import * as fs from 'fs';
import { Patient } from '../../database/models/patient.models';

export function generateHTMLReport(patients: Patient[]): string {
  const fileName = 'report.html';
  const html = `
    <html>
    <head>
      <title>Patient Report</title>
    </head>
    <body>
      <h1>Patient Report</h1>
      <table border="1">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Date of Consultation</th>
          <th>Reason for Consultation</th>
        </tr>
        ${patients
          .map(patient => `
            <tr>
              <td>${patient.id}</td>
              <td>${patient.name}</td>
              <td>${patient.age}</td>
              <td>${patient.appointmentDate}</td>
              <td>${patient.reason}</td>
            </tr>
          `)
          .join('')}
      </table>
    </body>
    </html>
  `;
  fs.writeFileSync(fileName, html, 'utf-8');
  console.log(`HTML report saved as ${fileName}`);
  return fileName;
}