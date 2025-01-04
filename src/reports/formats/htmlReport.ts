import { Patient } from '../../database/models/patient.models';
import * as fs from 'fs';

export function generateHTMLReport(patients: Patient[]): string {
  let htmlContent = `
    <html>
      <head>
        <title>Patients Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Patients Report</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Appointment Date</th>
          </tr>`;

  patients.forEach((patient) => {
    htmlContent += `
      <tr>
        <td>${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.age}</td>
        <td>${patient.phone}</td>
        <td>${patient.email}</td>
        <td>${patient.appointmentDate}</td>
      </tr>`;
  });

  htmlContent += `
        </table>
      </body>
    </html>`;

  // Salva o relatório em HTML
  fs.writeFileSync('patients_report.html', htmlContent);
  
  return 'HTML report generated successfully';
}