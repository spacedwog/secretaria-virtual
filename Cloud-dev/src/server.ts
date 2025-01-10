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
        this.app.get('/', (req: Request, res: Response) => {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Secretária Virtual</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f5f5f5;
                            color: #333;
                        }
                        header {
                            background-color: #0078d4;
                            color: white;
                            padding: 1rem;
                            text-align: center;
                        }
                        nav {
                            display: flex;
                            justify-content: center;
                            background-color: #005bb5;
                            padding: 0.5rem;
                        }
                        nav a {
                            color: white;
                            text-decoration: none;
                            margin: 0 1rem;
                            font-weight: bold;
                        }
                        nav a:hover {
                            text-decoration: underline;
                        }
                        main {
                            padding: 2rem;
                            max-width: 800px;
                            margin: auto;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        form {
                            display: flex;
                            flex-direction: column;
                        }
                        form label {
                            margin: 0.5rem 0 0.2rem;
                        }
                        form input, form select, form textarea, form button {
                            padding: 0.8rem;
                            margin-bottom: 1rem;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        form button {
                            background-color: #0078d4;
                            color: white;
                            border: none;
                            cursor: pointer;
                        }
                        form button:hover {
                            background-color: #005bb5;
                        }
                        footer {
                            text-align: center;
                            padding: 1rem;
                            background-color: #0078d4;
                            color: white;
                            margin-top: 2rem;
                        }
                    </style>
                </head>
                <body>
                    <header>
                        <h1>Secretária Virtual</h1>
                        <p>Gerencie seus pacientes de forma simples e eficiente</p>
                    </header>
                    <nav>
                        <a href="#cadastro">Cadastrar Paciente</a>
                        <a href="#relatorios">Relatórios</a>
                        <a href="#configuracoes">Configurações</a>
                    </nav>
                    <main>
                        <section id="cadastro">
                            <h2>Cadastro de Pacientes</h2>
                            <form>
                                <label for="nome">Nome Completo:</label>
                                <input type="text" id="nome" name="nome" required>
                                
                                <label for="email">E-mail:</label>
                                <input type="email" id="email" name="email" required>
                                
                                <label for="telefone">Telefone:</label>
                                <input type="tel" id="telefone" name="telefone" required>
                                
                                <label for="data-nascimento">Data de Nascimento:</label>
                                <input type="date" id="data-nascimento" name="data-nascimento" required>
                                
                                <label for="observacoes">Observações:</label>
                                <textarea id="observacoes" name="observacoes" rows="4"></textarea>
                                
                                <button type="submit">Cadastrar</button>
                            </form>
                        </section>
                        <section id="relatorios">
                            <h2>Relatórios</h2>
                            <p>Visualize e exporte os relatórios de atendimento.</p>
                            <button onclick="exportar('json')">Exportar em JSON</button>
                            <button onclick="exportar('html')">Exportar em HTML</button>
                            <button onclick="exportar('pdf')">Exportar em PDF</button>
                        </section>
                        <section id="configuracoes">
                            <h2>Configurações</h2>
                            <p>Personalize a aplicação conforme suas necessidades.</p>
                        </section>
                    </main>
                    <footer>
                        <p>© 2025 Secretária Virtual. Todos os direitos reservados.</p>
                    </footer>
        
                    <script>
                        function exportar(formato) {
                            alert(\`Exportando relatório em \${formato.toUpperCase()}\`);
                        }
                    </script>
                </body>
                </html>
            `);
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
        });

        process.on('SIGINT', async () => {
            console.log('\nEncerrando servidor...');
            clearInterval(this.pingInterval);
            await this.connection.end();
            console.log('Conexão com o banco de dados encerrada.');
            process.exit(0);
        });

        this.showMenu();
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