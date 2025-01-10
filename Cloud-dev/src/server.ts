import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise';
import readlineSync from 'readline-sync';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';

dotenv.config();

class Server {
    private readonly app: Express;
    private port: number;
    private dbConfig = {
        host: process.env.DB_HOST ?? 'localhost',
        user: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '6z2h1j3k9F!',
        database: process.env.DB_NAME ?? 'secretaria_virtual',
        connectTimeout: 10000,
    };
    private connection!: Connection;
    private pingInterval!: NodeJS.Timeout;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.setupMiddlewares();
        this.setupRoutes();
        this.initialize();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true })); // Para processar formulários com método POST
    }

    private setupRoutes() {
        

// Rota para buscar os dados do banco de dados
        this.app.get('/pacientes', async (req, res) => {
            try {
                const connection = await mysql.createConnection(this.dbConfig);

                const query = `
                        SELECT id, nome, email, telefone, data_nascimento, observacoes
                        FROM pacients;
                    `;
                const [rows] = await connection.execute(query);

                // Garante que o tipo é uma lista de objetos
                const pacientes = rows as Array<{
                    id: number;
                    nome: string;
                    email: string;
                    telefone: string;
                    data_nascimento: string;
                    observacoes: string | null;
                }>;

        await connection.end();

        // Renderizar uma tabela com os dados
        let html = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lista de Pacientes</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #0078d4;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Lista de Pacientes</h1>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                        <th>Observações</th>
                    </tr>
        `;

        pacientes.forEach((paciente) => {
            html += `
                <tr>
                    <td>${paciente.id}</td>
                    <td>${paciente.nome}</td>
                    <td>${paciente.email}</td>
                    <td>${paciente.telefone}</td>
                    <td>${paciente.data_nascimento}</td>
                    <td>${paciente.observacoes || ''}</td>
                </tr>
            `;
        });

        html += `
                </table>
                <a href="/">Voltar</a>
            </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).send('Erro ao buscar pacientes.');
    }
});

        // Demais rotas do seu código (não alteradas)
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

            // Mantém a conexão ativa
            this.pingInterval = setInterval(() => {
                this.connection.ping().then(() => console.log('Ping ao banco de dados.')).catch(console.error);
            }, 10000);
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

            const jsonPath = path.join(__dirname + "/receitas_medicas", 'receita_medica.json');
            const htmlPath = path.join(__dirname + "/receitas_medicas", 'receita_medica.html');
            const pdfPath = path.join(__dirname + "/receitas_medicas", 'receita_medica.pdf');

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

    private validateInput(input: string, type: 'string' | 'number' | 'date'): boolean {
        if (!input) return false;
        switch (type) {
            case 'number':
                return !isNaN(Number(input));
            case 'date':
                return !isNaN(Date.parse(input));
            case 'string':
                return input.trim().length > 0;
            default:
                return false;
        }
    }

    private async insertData() {
        let id_receita = readlineSync.question('ID da receita: ');
        while (!this.validateInput(id_receita, 'number')) {
            console.log('ID inválido. Tente novamente.');
            id_receita = readlineSync.question('ID da receita: ');
        }

        const nome_medicamento = readlineSync.question('Nome do medicamento: ');
        const dosagem = readlineSync.question('Dosagem: ');
        const frequencia = readlineSync.question('Frequência: ');
        const duracao = readlineSync.question('Duração: ');

        const id_paciente = readlineSync.question('ID do paciente: ');
        const id_medico = readlineSync.question('ID do médico: ');
        const data_prescricao = readlineSync.question('Data da prescrição (YYYY-MM-DD): ');

        while (!this.validateInput(data_prescricao, 'date')) {
            console.log('Data inválida. Use o formato YYYY-MM-DD.');
        }

        const observacoes = readlineSync.question('Observações: ');

        try {
            const queryMedicamento = `
                INSERT INTO medicamentos_receita (id_receita, nome_medicamento, dosagem, frequencia, duracao)
                VALUES (?, ?, ?, ?, ?)
            `;
            await this.connection.query(queryMedicamento, [id_receita, nome_medicamento, dosagem, frequencia, duracao]);
            console.log('Medicamento registrado com sucesso!');

            const queryReceita = `
                INSERT INTO receitas_medicas (id_receita, id_paciente, id_medico, data_prescricao, observacoes)
                VALUES (?, ?, ?, ?, ?)
            `;
            await this.connection.query(queryReceita, [id_receita, id_paciente, id_medico, data_prescricao, observacoes]);
            console.log('Receita registrada com sucesso!');
        } catch (error) {
            console.error('Erro ao inserir dados:', error);
        }
    }

    private async initialize() {
        await this.connectToDatabase();

        this.app.listen(this.port, () => {
            console.log(`Servidor rodando na porta ${this.port}`);
            this.showMenu();
        });

        process.on('SIGINT', async () => {
            console.log('\nEncerrando servidor...');
            clearInterval(this.pingInterval);
            await this.connection.end();
            console.log('Conexão com o banco de dados encerrada.');
            process.exit(0);
        });
    }

    private async showMenu(): Promise<void> {
        let exit;

        while (!exit) {
            console.log('\n--- MENU ---');
            console.log('1. Exibir Receita Médica');
            console.log('2. Registrar Receita Médica');
            console.log('3. Gerar Receita Médica');
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
            if (Array.isArray(rows) && rows.length > 0) {
                console.table(rows);
            } else {
                console.log('Nenhum dado encontrado.');
            }
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
        }
    }
}

new Server(3001);