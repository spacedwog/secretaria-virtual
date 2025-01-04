import { Patient } from '../../database/models/patient.model';
import * as fs from 'fs';
import PDFDocument from 'pdfkit';

export function generatePDFReport(patients: Patient[]): string {
  const doc = new PDFDocument();

  // Nome do arquivo PDF
  const filePath = 'patients_report.pdf';

  // Cria o arquivo de saída
  doc.pipe(fs.createWriteStream(filePath));

  // Título do relatório
  doc.fontSize(18).text('Patients Report', { align: 'center' });
  doc.moveDown();

  // Cabeçalho da tabela
  doc.fontSize(12).text('ID    Name           Age    Phone         Email              Appointment Date');
  doc.moveDown();

  // Adiciona os dados dos pacientes
  patients.forEach((patient) => {
    const row = `${patient.id.toString().padEnd(6)} ${patient.name.padEnd(15)} ${patient.age.toString().padEnd(5)} ${patient.phone.padEnd(12)} ${patient.email.padEnd(20)} ${patient.appointmentDate}`;
    doc.text(row);
  });

  // Finaliza a criação do PDF
  doc.end();

  return 'PDF report generated successfully';
}