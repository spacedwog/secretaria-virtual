import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise';
import readlineSync from 'readline-sync';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

class Server {
    private app: Express;
    private port: number;
    private dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '6z2h1j3k9F!',
        database: 'secretaria_virtual',
        connectTimeout: 10000,
    };
    private connection!: Connection;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.setupMiddlewares();
        this.setupRoutes();
        this.initialize();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
    }

    private setupRoutes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Servidor rodando em TypeScript com MySQL!');
        });

        this.app.get('/dados', this.getData.bind(this));
        this.app.get('/gerar-relatorio', async (req: Request, res: Response) => {
            await this.generateReport();
            res.send('Relatório gerado com sucesso!');
        });
    }

    private async connectToDatabase() {
        try {
            this.connection = await mysql.createConnection(this.dbConfig);
            console.log('Conexão com o banco de dados estabelecida!');
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            process.exit(1);
        }
    }

    private async getData(req: Request, res: Response) {
        try {
            const [rows] = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
        }
    }

    private async generateReport() {
        try {
            const [rows]: any = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');

            if (!rows.length) {
                console.log('Nenhum dado encontrado para o relatório.');
                return;
            }

            const jsonPath = path.join(__dirname, 'receita_medica.json');
            const htmlPath = path.join(__dirname, 'receita_medica.html');
            const pdfPath = path.join(__dirname, 'receita_medica.pdf');

            fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
            console.log(`Relatório JSON salvo em: ${jsonPath}`);

            const htmlContent = this.generateHTMLContent(rows);
            fs.writeFileSync(htmlPath, htmlContent);
            console.log(`Relatório HTML salvo em: ${htmlPath}`);

            this.generatePDF(rows, pdfPath);
            console.log(`Relatório PDF salvo em: ${pdfPath}`);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        }
    }

    private generateHTMLContent(rows: any[]): string {
        const tableRows = rows.map(row => `
            <tr>
                <td>${row.id_receita}</td>
                <td>${row.nome_paciente}</td>
                <td>${row.nome_medico}</td>
                <td>${row.data_prescricao}</td>
                <td>${row.observacoes}</td>
                <td>${row.nome_medicamento}</td>
                <td>${row.dosagem}</td>
                <td>${row.frequencia}</td>
                <td>${row.duracao}</td>
            </tr>`).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Relatório</title>
        </head>
        <body>
            <h1>Relatório de Receitas</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID Receita</th>
                        <th>Nome do Paciente</th>
                        <th>Nome do Médico</th>
                        <th>Data da Prescrição</th>
                        <th>Observações</th>
                        <th>Nome do Medicamento</th>
                        <th>Dosagem</th>
                        <th>Frequência</th>
                        <th>Duração</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>`;
    }

    private generatePDF(rows: any[], filePath: string): void {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(18).text('Relatório de Receitas', { align: 'center' });
        doc.moveDown();

        rows.forEach(row => {
            doc.fontSize(12).text(`ID Receita: ${row.id_receita}`);
            doc.text(`Nome do Paciente: ${row.nome_paciente}`);
            doc.text(`Nome do Médico: ${row.nome_medico}`);
            doc.text(`Data da Prescrição: ${row.data_prescricao}`);
            doc.text(`Observações: ${row.observacoes}`);
            doc.text(`Nome do Medicamento: ${row.nome_medicamento}`);
            doc.text(`Dosagem: ${row.dosagem}`);
            doc.text(`Frequência: ${row.frequencia}`);
            doc.text(`Duração: ${row.duracao}`);
            doc.moveDown();
        });

        doc.end();
    }

    private async showMenu(): Promise<void> {
        let exit = false;

        while (!exit) {
            console.log('\n--- MENU ---');
            console.log('1. Visualizar dados');
            console.log('2. Inserir dados');
            console.log('3. Gerar relatorio');
            console.log('4. Sair');

            const choice = readlineSync.question('Escolha uma opcao: ');

            switch (choice) {
                case '1':
                    await this.getDataFromDB();
                    break;
                case '2':
                    await this.insertData();
                    break;
                case '3':
                    await this.generateReport();
                    break;
                case '4':
                    exit = true;
                    console.log('Saindo...');
                    break;
                default:
                    console.log('Opção inválida.');
            }
        }
    }

    private async getDataFromDB() {
        try {
            const [rows] = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');
            // Verifique se rows é um array
            if (Array.isArray(rows) && rows.length > 0) {
                console.log('\n--- DADOS RETORNADOS DO BANCO ---');
                console.table(
                    rows.map((row: any) => ({
                        'ID Receita': row.id_receita,
                        'Paciente': row.nome_paciente,
                        'Médico': row.nome_medico,
                        'Data Prescrição': row.data_prescricao,
                        'Observações': row.observacoes,
                        'Medicamento': row.nome_medicamento,
                        'Dosagem': row.dosagem,
                        'Frequência': row.frequencia,
                        'Duração': row.duracao,
                    }))
                );
            }
            else {
                console.log('Nenhum dado encontrado.');
            }
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
        }
    }

    private async insertData() {
        const id_receita = parseInt(readlineSync.question('ID da receita: '), 10);
        const nome_medicamento = readlineSync.question('Nome do medicamento: ');
        const dosagem = readlineSync.question('Dosagem: ');
        const frequencia = readlineSync.question('Frequencia: ');
        const duracao = readlineSync.question('Duracao: ');

        const id_paciente = parseInt(readlineSync.question('ID do paciente: '), 10);
        const id_medico = parseInt(readlineSync.question('ID do medico: '), 10);
        const data_prescricao = readlineSync.question('Data da prescricao (YYYY-MM-DD): ');
        const observacoes = readlineSync.question('Observacoes: ');

        try {
            const queryMedicamento = `
                INSERT INTO medicamentos_receita (id_receita, nome_medicamento, dosagem, frequencia, duracao)
                VALUES (?, ?, ?, ?, ?)
            `;
            await this.connection.query(queryMedicamento, [id_receita, nome_medicamento, dosagem, frequencia, duracao]);
            console.log('Medicamento registrado com sucesso!');

            const queryReceita = `
                INSERT INTO receitas_medicas (id_receita, id_paciente, id_medico, data_prescricao, observacoes)
                VALUES(?, ?, ?, ?, ?)
            `;
            await this.connection.query(queryReceita, [id_receita, id_paciente, id_medico, data_prescricao, observacoes]);
            console.log('Receita registrada com sucesso!');
        } catch (error) {
            console.error('Erro ao inserir dados:', error);
        }
    }

    private async initialize() {
        await this.connectToDatabase();
        this.showMenu();
    }
}

new Server(3000);