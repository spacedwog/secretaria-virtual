import connection from '../database';
import fs from 'fs';
import path from 'path';

export const gerarRelatorioJSON = () => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório JSON:', err);
            return;
        }
        const filePath = path.join(__dirname, '../output/consulta.json');
        fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
        console.log('Relatório JSON gerado em consulta.json');
    });
};

export const gerarRelatorioHTML = () => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Erro ao gerar relatório HTML:', err);
            return;
        }
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
    });
};