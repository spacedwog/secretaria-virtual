"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDFReport = generatePDFReport;
const fs = __importStar(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
function generatePDFReport(patients) {
    const doc = new pdfkit_1.default();
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
