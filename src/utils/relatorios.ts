import connection from '../database'; // Supondo que você tenha uma configuração de conexão com o banco de dados
import fs from 'fs';
import path from 'path';

// Função para gerar relatório em formato JSON
export const gerarRelatorioJSON = () => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório JSON:', err);
            return;
        }
        
        // Verifica se 'results' é um array antes de usar map
        if (Array.isArray(results)) {
            const filePath = path.join(__dirname, '../output/consulta.json');
            fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
            console.log('Relatório JSON gerado em consulta.json');
        } else {
            console.error('O formato de dados retornado não é um array');
        }
    });
};

// Função para gerar relatório em formato HTML
export const gerarRelatorioHTML = () => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
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
                            ${results.map((paciente: any) => `
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
            const filePath = path.join(__dirname, '../output/consulta.html');
            fs.writeFileSync(filePath, htmlContent);
            console.log('Relatório HTML gerado em consulta.html');
        } else {
            console.error('O formato de dados retornado não é um array');
        }
    });
};

// Função para gerar relatório em formato PDF (exemplo básico)
export const gerarRelatorioPDF = () => {
    const PDFDocument = require('pdfkit');
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório PDF:', err);
            return;
        }
        
        if (Array.isArray(results)) {
            const doc = new PDFDocument();
            const filePath = path.join(__dirname, '../output/consulta.pdf');
            doc.pipe(fs.createWriteStream(filePath));

            doc.fontSize(25).text('Relatório de Pacientes', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text('ID | Nome | Telefone | Email | Data de Nascimento');
            doc.moveDown();

            results.forEach((paciente: any) => {
                doc.text(`${paciente.id} | ${paciente.nome} | ${paciente.telefone} | ${paciente.email} | ${paciente.data_nascimento}`);
            });

            doc.end();
            console.log('Relatório PDF gerado em consulta.pdf');
        } else {
            console.error('O formato de dados retornado não é um array');
        }
    });
};