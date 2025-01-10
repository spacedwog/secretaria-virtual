import fs from 'fs';
import net from 'net';
import path from 'path';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import readlineSync from 'readline-sync';
import mysql, { Connection } from 'mysql2/promise';
import express, { Request, Response, Express } from 'express';

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
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes() {
        this.app.get('/', this.getPacientes.bind(this));
        this.app.get('/dados', this.getData.bind(this));
        this.app.get('/gerar-relatorio', this.generateReportRoute.bind(this));
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
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #0078d4; color: white; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
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
            html += `</table></body></html>`;
            res.send(html);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            res.status(500).send('Erro ao buscar pacientes.');
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

    private async generateReportRoute(req: Request, res: Response) {
        await this.generateReport();
        res.send('Relatório gerado com sucesso!');
    }

    private async generateReport() {
        // Mesma lógica do código anterior para JSON, HTML e PDF
    }

    private async initialize() {
        try {
            await this.connectToDatabase();
            await this.checkPortAvailability();

            this.app.listen(this.port, () =>
                console.log(`Servidor rodando em http://localhost:${this.port}`)
            );
        } catch (error) {
            console.error('Erro ao inicializar o servidor:', error);
            process.exit(1);
        }
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