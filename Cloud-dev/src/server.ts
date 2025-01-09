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
        connectTimeout: 10000, // Tempo limite para a conexão
    };
    private connection!: Connection;

    private id_paciente: number;
    private id_medico: number;
    private id_receita: number;
    private data_prescricao: string;
    private observacao: string;
    private nome_medicamento: string;
    private dosagem: string;
    private frequencia: string;
    private duracao: string;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.id_paciente = 0;
        this.id_medico = 0;
        this.id_receita = 0;
        this.data_prescricao = "";
        this.observacao = "";
        this.nome_medicamento = "";
        this.dosagem = "";
        this.frequencia = "";
        this.duracao = "";

        this.setupMiddlewares();
        this.setupRoutes();
        this.initialize();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
    }

    private setupRoutes() {
        // Rota principal
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Servidor rodando em TypeScript com MySQL!');
        });

        // Rota para testar consulta ao banco
        this.app.get('/dados', this.getData.bind(this));

        // Rota para gerar relatórios
        this.app.get('/gerar-relatorio', async (req: Request, res: Response) => {
            await this.generateReport();
            res.send('Relatório gerado com sucesso. Confira os arquivos gerados no servidor.');
        });
    }

    private async connectToDatabase() {
        try {
            console.log('Tentando conectar ao banco de dados...');
            this.connection = await mysql.createConnection(this.dbConfig);
            console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados MySQL:', error);
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

    private async readFromTerminal(): Promise<void> {
        // Aguarda a conexão ao banco de dados
        if (!this.connection) {
            console.log('Conexão ao banco de dados ainda não está pronta. Tentando conectar...');
            await this.connectToDatabase();
        }

        console.log('Entre com os dados para inserir uma nova receita.');

        const id_paciente = parseInt(readlineSync.question('ID do paciente: '), 10);
        const id_medico = parseInt(readlineSync.question('ID do medico'), 10);
        const id_receita = parseInt(readlineSync.question('ID do receita'), 10);
        const data_prescricao = readlineSync.question('Data da prescrição (YYYY-MM-DD): ');
        const observacoes = readlineSync.question('Observações: ');

        const nome_medicamento = readlineSync.question('Nome do medicamento: ');
        const dosagem = readlineSync.question('Dosagem: ');
        const frequencia = readlineSync.question('Frequência: ');
        const duracao = readlineSync.question('Duração: ');

        try {
            const queryMedicamento = `
                INSERT INTO medicamentos_receita (id_receita, nome_medicamento, dosagem, frequencia, duracao)
                VALUES (?, ?, ?, ?, ?)
            `;

            await this.connection.query(queryMedicamento, [
                id_receita,
                nome_medicamento,
                dosagem,
                frequencia,
                duracao,
            ]);
            const queryReceita = `
                INSERT INTO receitas_medicas (id_receita, id_paciente, id_medico, data_prescricao, observacoes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await this.connection.query(queryReceita, [
                id_receita,
                id_paciente,
                id_medico,
                data_prescricao,
                observacoes,
            ]);

            console.log('Dados inseridos com sucesso no banco de dados!');
        } catch (error) {
            console.error('Erro ao inserir dados no banco:', error);
        }
    }

    private async generateReport(): Promise<void> {
        console.log('Gerando relatório...');

        try {
            // Consultar os dados no banco de dados
            const [rows]: any = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');

            if (!rows.length) {
                console.log('Nenhum dado encontrado para o relatório.');
                return;
            }

            // Caminhos para salvar os arquivos
            const jsonPath = path.join(__dirname, 'relatorio.json');
            const htmlPath = path.join(__dirname, 'relatorio.html');
            const pdfPath = path.join(__dirname, 'relatorio.pdf');

            // Gerar relatório em JSON
            fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
            console.log(`Relatório JSON salvo em: ${jsonPath}`);

            // Gerar relatório em HTML
            const htmlContent = this.generateHTMLContent(rows);
            fs.writeFileSync(htmlPath, htmlContent);
            console.log(`Relatório HTML salvo em: ${htmlPath}`);

            // Gerar relatório em PDF
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

    private async initialize() {
        await this.connectToDatabase();
        this.app.listen(this.port, () => {
            console.log(`Servidor está rodando em http://localhost:${this.port}`);
        }).on('error', (err) => {
            const error = err as NodeJS.ErrnoException; // Type assertion para incluir 'code'
            if (error.code === 'EADDRINUSE') {
                console.error(`Porta ${this.port} já está em uso. Tentando outra porta...`);
                this.port += 1; // Tenta a próxima porta
                this.initialize();
            }
        });
    }
}

// Cria e inicia o servidor
new Server(3000);