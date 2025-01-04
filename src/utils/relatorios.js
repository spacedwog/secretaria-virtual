"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioPDF = exports.gerarRelatorioHTML = exports.gerarRelatorioJSON = void 0;
const database_1 = __importDefault(require("../database")); // Supondo que você tenha uma configuração de conexão com o banco de dados
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Função para gerar relatório em formato JSON
const gerarRelatorioJSON = () => {
    database_1.default.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório JSON:', err);
            return;
        }
        // Verifica se 'results' é um array antes de usar map
        if (Array.isArray(results)) {
            const filePath = path_1.default.join(__dirname, '../output/consulta.json');
            fs_1.default.writeFileSync(filePath, JSON.stringify(results, null, 2));
            console.log('Relatório JSON gerado em consulta.json');
        }
        else {
            console.error('O formato de dados retornado não é um array');
        }
    });
};
exports.gerarRelatorioJSON = gerarRelatorioJSON;
// Função para gerar relatório em formato HTML
const gerarRelatorioHTML = () => {
    database_1.default.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório HTML:', err);
            return;
        }
        // Verifica se 'results' é um array antes de usar map
        if (Array.isArray(results)) {
            const htmlContent = `
                <html>
                    <head><title>Relatório de Pacientes</title></head>
                    <body>
                        <h1>Relatório de Pacientes</h1>
                        <table border="1">
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>Data de Nascimento</th>
                            </tr>
                            ${results.map((paciente) => `
                                <tr>
                                    <td>${paciente.id}</td>
                                    <td>${paciente.nome}</td>
                                    <td>${paciente.telefone}</td>
                                    <td>${paciente.email}</td>
                                    <td>${paciente.data_nascimento}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </body>
                </html>
            `;
            const filePath = path_1.default.join(__dirname, '../output/consulta.html');
            fs_1.default.writeFileSync(filePath, htmlContent);
            console.log('Relatório HTML gerado em consulta.html');
        }
        else {
            console.error('O formato de dados retornado não é um array');
        }
    });
};
exports.gerarRelatorioHTML = gerarRelatorioHTML;
// Função para gerar relatório em formato PDF (exemplo básico)
const gerarRelatorioPDF = () => {
    const PDFDocument = require('pdfkit');
    database_1.default.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório PDF:', err);
            return;
        }
        if (Array.isArray(results)) {
            const doc = new PDFDocument();
            const filePath = path_1.default.join(__dirname, '../output/consulta.pdf');
            doc.pipe(fs_1.default.createWriteStream(filePath));
            doc.fontSize(25).text('Relatório de Pacientes', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text('ID | Nome | Telefone | Email | Data de Nascimento');
            doc.moveDown();
            results.forEach((paciente) => {
                doc.text(`${paciente.id} | ${paciente.nome} | ${paciente.telefone} | ${paciente.email} | ${paciente.data_nascimento}`);
            });
            doc.end();
            console.log('Relatório PDF gerado em consulta.pdf');
        }
        else {
            console.error('O formato de dados retornado não é um array');
        }
    });
};
exports.gerarRelatorioPDF = gerarRelatorioPDF;
