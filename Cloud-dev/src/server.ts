import net from 'net';
import path from 'path';
import dotenv from 'dotenv';
import mysql, { Connection } from 'mysql2/promise';
import express, { Request, Response, Express, NextFunction } from 'express';

dotenv.config();

class Server {
    private readonly app: Express;
    private readonly port: number;
    private readonly dbConfig = {
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
        // Middleware para parse de JSON e form data
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    
        // Middleware para logar as requisições
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent']}`);
            next();
        });
    
        // Middleware para servir arquivos estáticos
        const staticPath = path.join(__dirname, 'public');
        this.app.use(express.static(staticPath));
    
        // Middleware para configurar headers (ex.: CORS)
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    
        // Middleware para tratar erros genéricos
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error('Erro no middleware:', err);
            res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
        });
    }

    private setupRoutes() {
        this.app.get('/paciente', this.getPacientes.bind(this));
        this.app.get('/receita_medica', this.getReceita_medica.bind(this));

        this.app.get('/gerar-relatorio', async (req: Request, res: Response) => {
            try {
                await this.generateReport();
                res.redirect('/'); // Redireciona diretamente
            }
            catch (error) {
                console.error('Erro ao gerar relatório:', error);
                res.status(500).send('Erro ao gerar relatório.');
            }
        });

    }

    private async connectToDatabase() {
        try {
            this.connection = await mysql.createConnection(this.dbConfig);
            console.log('Conexão com o banco de dados estabelecida!');

            this.pingInterval = setInterval(() => {
                this.connection.ping().then(() => console.log('Ping ao banco de dados.')).catch(console.error);
            }, 10000);
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            process.exit(1);
        }
    }

    private async getPacientes(req: Request, res: Response) {
        try {
            const query = `SELECT patient_id, name, age, phone, email, address FROM patients;`;
            const [rows] = await this.connection.query(query);

            const pacientes = rows as Array<{
                patient_id: number;
                name: string;
                age: number;
                phone: string;
                email: string;
                address: string | null;
            }>;

            let html = `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Lista de Pacientes</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #0078d4; color: white; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
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
                        <a href="/receita_medica">Visualizar Receita Médica</a>
                        <a href="/gerar-relatorio">Relatórios Médicos</a>
                    </nav>
                    <h1>Lista de Pacientes</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Endereço</th>
                        </tr>`;
                        pacientes.forEach((p) => {
                            html += `
                            <tr>
                                <td>${p.patient_id}</td>
                                <td>${p.name}</td>
                                <td>${p.age}</td>
                                <td>${p.phone}</td>
                                <td>${p.email}</td>
                                <td>${p.address ?? ''}</td>
                            </tr>`;
                        });
            html += `</table>
                        </body>
            </html>`;
            res.send(html);
        }
        catch (error) {
            console.error('Erro ao buscar dados:', error);
            res.status(500).send('Erro ao buscar pacientes.');
        }
    }

    private async getReceita_medica(req: Request, res: Response) {
        try {
            const query = `SELECT id_receita, nome_paciente, nome_medicamento, data_prescricao, dosagem, frequencia, duracao, observacoes, nome_medico FROM vw_receitas_detalhadas;`;
            const [rows] = await this.connection.query(query);

            const receitas = rows as Array<{
                id_receita: number;
                nome_paciente: string;
                nome_medicamento: number;
                data_prescricao: string | null;
                dosagem: string;
                frequencia: string;
                duracao: string;
                observacoes: string | null;
                nome_medico: string;
            }>;

            let html = `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Lista de Pacientes</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #0078d4; color: white; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Receitas Médicas</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Nome do Paciente</th>
                            <th>Nome do Medicamento</th>
                            <th>Data da Prescrição</th>
                            <th>Dosagem</th>
                            <th>Frequência</th>
                            <th>Duração</th>
                            <th>Observações</th>
                            <th>Nome do Médico</th>
                        </tr>`;
            receitas.forEach((r) => {
                html += `
                    <tr>
                        <td>${r.id_receita}</td>
                        <td>${r.nome_paciente}</td>
                        <td>${r.nome_medicamento}</td>
                        <td>${r.data_prescricao ?? ''}</td>
                        <td>${r.dosagem}</td>
                        <td>${r.frequencia}</td>
                        <td>${r.duracao}</td>
                        <td>${r.observacoes ?? ''}</td>
                        <td>${r.nome_medico}</td>
                    </tr>`;
            });
            html += `</table></body></html>`;
            res.send(html);
        }
        catch (error) {
            console.error('Erro ao buscar dados:', error);
            res.status(500).send('Erro ao buscar pacientes.');
        }
    }

    private async generateReportRoute(req: Request, res: Response) {
        await this.generateReport();
        res.send('Relatório gerado com sucesso!');
        res.redirect('/paciente');
    }

    private async generateReport() {
        // Mesma lógica do código anterior para JSON, HTML e PDF
    }

    private async initialize() {
        
        await this.connectToDatabase();

        const startServer = (port: number) => {
            this.app.listen(port, () => {
                console.log(`Servidor rodando na porta ${port}`);
            }).on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    console.error(`Porta ${port} já está em uso.`);
                    const alternativePort = port + 1;
                    console.log(`Tentando porta alternativa ${alternativePort}...`);
                    startServer(alternativePort);
                } else {
                    throw err;
                }
            });
        };

        startServer(this.port);

        process.on('SIGINT', async () => {
            console.log('\nEncerrando servidor...');
            clearInterval(this.pingInterval);
            await this.connection.end();
            console.log('Conexão com o banco de dados encerrada.');
            process.exit(0);
        });

    }

    private async checkPortAvailability() {
        return new Promise<void>((resolve, reject) => {
            const server = net.createServer();
            server.once('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    console.error(`A porta ${this.port} já está em uso.`);
                    reject(err);
                }
            });
            server.once('listening', () => {
                server.close();
                resolve();
            });
            server.listen(this.port);
        });
    }
}

new Server(3000);