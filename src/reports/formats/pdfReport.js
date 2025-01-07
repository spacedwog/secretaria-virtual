"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDFReport = generatePDFReport;
const jspdf_1 = require("jspdf");
function generatePDFReport(patients) {
    const doc = new jspdf_1.jsPDF();
    const fileName = 'report.pdf';
    doc.text('Patient Report', 10, 10);
    let y = 20;
    patients.forEach(patient => {
        doc.text(`ID: ${patient.id}`, 10, y);
        doc.text(`Name: ${patient.name}`, 10, y + 10);
        doc.text(`Age: ${patient.age}`, 10, y + 20);
        doc.text(`Date of Consultation: ${patient.consultationDate}`, 10, y + 30);
        doc.text(`Reason: ${patient.reason}`, 10, y + 40);
        y += 50;
    });
    doc.save(fileName);
    console.log(`PDF report saved as ${fileName}`);
    return fileName;
}
