import path from 'path';
import express from 'express';
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import net from 'net';
import { fileURLToPath } from 'url';
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { Request, Response, NextFunction } from 'express';

dotenv.config();

enum StatusCode {
    ExitSuccess = 0,
    ExitFail    = 1,
    DatabaseSuccess = 200,
    DatabaseError   = 500,
}

const UPDATE_DATA_ENDPOINT = "/update-data";
const RECORD_DATA_ENDPOINT = "/record-data";
const SAVE_DATA_ENDPOINT = "/save-data";

const scriptPath = './cloudengine.ps1';

export class Server{

    private readonly app: express.Express;

    private readonly port: number;
    private readonly dbConfig = {
        host: process.env.DB_HOST ?? '127.0.0.1',
        user: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '6z2h1j3k9F!',
        database: process.env.DB_NAME ?? 'secretaria_virtual',
        connectTimeout: 10000,
    };

    private readonly dbRemidConfig = {

        host: process.env.DB_REMID_HOST?? 'localhost',
        user: process.env.DB_REMID_USER?? 'root',
        password: process.env.DB_REMID_PASSWORD?? '6z2h1j3k9F!',
        database: process.env.DB_REMID_NAME??'gerenciamentomedicamentos',
        connectTimeout: 10000,

    }

    private connection!: mysql.Connection;
    private pingInterval!: NodeJS.Timeout;
    
    private key = "";
    private value = "";

    constructor(port: number) {
        
        this.app = express();
        this.port = port;

        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares() {

        // Middleware para parse de JSON e form data
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        //Middleware do tipo: Parse
        //Descrição: Serve para parsear o corpo das requisições como JSON
        this.app.use(bodyParser.json());
    
        //Middleware do tipo: Log
        //Descrição: Serve para logar as requisições
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent']}`);
            next();
        });
    
        //Middleware do tipo: Join
        //Descrição: Serve para servir arquivos estáticos
        // Definir __filename e __dirname manualmente
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const staticPath = path.join(__dirname, 'public');
        this.app.use(express.static(staticPath));
        
        //Middleware do tipo: Config
        //Descrição: Serve para configurar headers (ex.: CORS)
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    
        //Middleware do tipo: Error
        //Descrição: Serve para tratar erros genéricos
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error('Erro no middleware:', err);
            res.status(err.status || StatusCode.DatabaseError).json({ error: err.message || 'Erro interno do servidor' });
        });
    }

    private setupRoutes() {

        this.app.get('/', this.viewMedicInfo.bind(this));
        this.app.get('/paciente', this.getPacientes.bind(this));
        this.app.get('/consulta_medica', this.viewWebsite.bind(this));
        this.app.get('/receita_medica', this.getReceita_medica.bind(this));

        this.app.get('/gerar-relatorio', async (req: Request, res: Response) => {
            try {
                await this.generateReport();
                res.redirect('/'); // Redireciona diretamente
            }
            catch (error) {
                console.error('Erro ao gerar relatório:', error);
                res.status(StatusCode.DatabaseError).send('Erro ao gerar relatório.');
            }
        });

        // Endpoint para receber dados do Python
        this.app.post(UPDATE_DATA_ENDPOINT, (req: Request, res: Response) => {

            const { key, value } = req.body;
        
            if ((key && typeof key !== 'string') || (value && typeof value !== 'string')) {
                res.status(400).json({ message: 'Dados inválidos enviados!' });
            }
        
            console.log('Dados recebidos:', { key, value });

            this.setKey(key);
            this.setValue(value);
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });

        // Endpoint para receber dados do Python
        this.app.post(RECORD_DATA_ENDPOINT, (req: Request, res: Response) => {

            const { id_paciente, id_medico, id_receita,
                code_medic, id_medic, nome_medic, tipo_medic, data_medic,
                dosagem, frequencia, consumo, observacao } = req.body;
        
            if ((id_paciente && typeof id_paciente !== 'number') ||
                (id_medico && typeof id_medico !== 'number') ||
                (id_receita && typeof id_receita !== 'number') ||
                (code_medic && typeof code_medic!== 'string') ||
                (id_medic && typeof id_medic !== 'number') ||
                (nome_medic && typeof nome_medic!=='string') ||
                (tipo_medic && typeof tipo_medic!=='string') ||
                (data_medic && typeof data_medic!=='string') ||
                (dosagem && typeof dosagem!== 'number') ||
                (frequencia && typeof frequencia!== 'string') ||
                (consumo && typeof consumo!== 'string') ||
                (observacao && typeof observacao!== 'string')) {
                res.status(400).json({ message: 'Dados inválidos enviados!' });
            }
        
            console.log('Dados recebidos:', { id_paciente, id_medico, id_receita,
                                            code_medic, id_medic, nome_medic, tipo_medic, data_medic,
                                            dosagem, frequencia, consumo, observacao});
            
            const currentDate = new Date();
            const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

            this.connection.query(
                'CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [code_medic, id_paciente, id_medico, data_medic, observacao, id_receita, id_medic, nome_medic, tipo_medic, dosagem, frequencia, consumo, observacao]
            );

            this.connection.query(
                'CALL visit_doctor(?, ?, ?, ?)',
                [date, time, id_paciente, id_medico]
            );
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });

        // Endpoint para receber dados do Python
        this.app.post(SAVE_DATA_ENDPOINT, (req: Request, res: Response) => {

            const { id_paciente, id_medico, nome_consulta_medica,
                appointment_date, appointment_time, reason, status } = req.body;
        
            if ((id_paciente && typeof id_paciente !== 'number') ||
                (id_medico && typeof id_medico !== 'number') ||
                (nome_consulta_medica && typeof nome_consulta_medica !== 'string') ||
                (appointment_date && typeof appointment_date!== 'string') ||
                (appointment_time && typeof appointment_time !== 'string') ||
                (reason && typeof reason!=='string') ||
                (status && typeof status!== 'string')) {
                res.status(400).json({ message: 'Dados inválidos enviados!' });
            }
        
            console.log('Dados recebidos:', { id_paciente, id_medico,
                                            nome_consulta_medica,
                                            appointment_date, appointment_time,
                                            reason, status });

            this.connection.query(
                'CALL make_appointment(?, ?, ?, ?, ?, ?, ?)',
                [appointment_date, appointment_time, reason, status, id_paciente, id_medico, nome_consulta_medica]
            );
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });

        this.initialize();

    }

    private async connectToDatabase() {

        try {
            this.connection = await mysql.createConnection(this.dbConfig);
            const params = {
                function: "connectToDatabase()",
                mensagem: "Conexao com o banco de dados estabelecida!",
                return_code: 0,
                type_server: "typescript"
            }
            runPowerShellScriptInThread(scriptPath, params);
            console.log('Conexão com o banco de dados estabelecida!');

            this.pingInterval = setInterval(() => {
                this.connection.ping().then(() => console.log('Ping ao banco de dados.')).catch(console.error);
                
            }, 10000);
        }
        catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            process.exit(StatusCode.ExitFail);
        }

    }

    private async viewMedicInfo(req: Request, res: Response) {
        try{

            const select = "SELECT med_code, nome_do_medicamento, tipo_do_medicamento, dosagem_do_medicamento, frequencia_de_administracao, duracao_da_administracao, observacoes_do_medicamento, DATE_FORMAT(data_da_prescricao, '%d/%M/%Y') AS data_da_prescricao ";
            const tabela = "FROM medicamento_info ";
            let condicao = "";
            if(this.getKey()!= ""){
                condicao = "WHERE med_code = '" + this.getValue() + "' AND tipo_do_medicamento = '" + this.getKey() + "'";
            }

            const query = select + tabela + condicao;
            console.log(query)
            const [rows] = await this.connection.query(query);
    
            const medicamento = rows as Array<{
                med_code: string;
                nome_do_medicamento: string;
                tipo_do_medicamento: string;
                dosagem_do_medicamento: string;
                frequencia_de_administracao: string;
                duracao_da_administracao: string;
                observacoes_do_medicamento: string;
                data_da_prescricao: string | null;
            }>;
            let css = `
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
                        </style>`;
            let html = `
                <!DOCTYPE html>
                <html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Secretaria Virtual</title>`;
                        html += css;
                        html += `
                    </head>
                    <body>
                        <header>
                            <h1>Secretária Virtual</h1>
                            <p>Gerencie seus pacientes de forma simples e eficiente</p>
                        </header>
                        <nav>
                            <a href="/">Home</a>
                            <a href="/consulta_medica">Consultas Médicas</a>
                            <a href="/paciente">Visitas Médicas</a>
                            <a href="/receita_medica">Visualizar Receita Médica</a>
                        </nav>
                        <h1>Informações do Medicamento</h1>
                        <table>
                            <tr>
                                <th>Código do Medicamento</th>
                                <th>Nome do Medicamento</th>
                                <th>Tipo do Medicamento</th>
                                <th>Dosagem do Medicamento</th>
                                <th>Frequencia de Administração</th>
                                <th>Duração da Administração</th>
                                <th>Observações do Medicamento</th>
                                <th>Data da Prescrição</th>
                            </tr>`;
                            medicamento.forEach((m) => {
                                html += `
                                <tr>
                                    <td>${m.med_code}</td>
                                    <td>${m.nome_do_medicamento}</td>
                                    <td>${m.tipo_do_medicamento}</td>
                                    <td>${m.dosagem_do_medicamento}</td>
                                    <td>${m.frequencia_de_administracao}</td>
                                    <td>${m.duracao_da_administracao}</td>
                                    <td>${m.observacoes_do_medicamento}</td>
                                    <td>${m.data_da_prescricao}</td>
                                </tr>`;
                            });
                                html += `
                        </table>
                    </body>
                </html>`;
                res.send(html);
                
        }
        catch (error) {
            console.error('Erro ao executar consulta:', error);
            res.status(StatusCode.DatabaseError).send('Erro ao carregar dados.');
        }
    }

    private async viewWebsite(req: Request, res: Response) {

        try{
            const query = `SELECT nome_consulta_medica, patient_name, DATE_FORMAT(appointment_date, '%d/%M/%Y') as appointment_date, appointment_time, status, doctor_name FROM patient_appointments_view ORDER BY appointment_date, appointment_time ASC;`;
            const [rows] = await this.connection.query(query);
    
            const appointment = rows as Array<{
                nome_consulta_medica: string;
                patient_name: string;
                appointment_date: string | null;
                appointment_time: string | null;
                status: string;
                doctor_name: string;
            }>;

            let html = `
                <!DOCTYPE html>
                <html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Secretaria Virtual</title>
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
                            <a href="/">Home</a>
                            <a href="/consulta_medica">Consultas Médicas</a>
                            <a href="/paciente">Visitas Médicas</a>
                            <a href="/receita_medica">Visualizar Receita Médica</a>
                        </nav>
                        <h1>Consultas Médicas</h1>
                        <table>
                            <tr>
                                <th>consulta médica</th>
                                <th>Nome do Paciente</th>
                                <th>Data da Consulta</th>
                                <th>Hora da Consulta</th>
                                <th>Status da Consulta Médica</th>
                                <th>Nome do Doutor</th>
                            </tr>`;
                            appointment.forEach((a) => {
                                html += `
                                <tr>
                                    <td>${a.nome_consulta_medica}</td>
                                    <td>${a.patient_name}</td>
                                    <td>${a.appointment_date}</td>
                                    <td>${a.appointment_time}</td>
                                    <td>${a.status}</td>
                                    <td>${a.doctor_name}</td>
                                </tr>`;
                            });
                                html += `
                        </table>
                    </body>
                </html>`;
                res.send(html);
                
        }
        catch (error) {
            console.error('Erro ao executar consulta:', error);
            res.status(StatusCode.DatabaseError).send('Erro ao carregar dados.');
        }
    }

    private async getPacientes(req: Request, res: Response) {
        try {
            const query = `SELECT patient_id, name, age, phone, email, address, DATE_FORMAT(visit_date, '%d/%M/%Y') AS visit_date, visit_time from pacient_view;`;
            const [rows] = await this.connection.query(query);

            const pacientes = rows as Array<{
                patient_id: number;
                name: string;
                age: number;
                phone: string;
                email: string;
                address: string | null;
                visit_date: string | null;
                visit_time: string | null;
            }>;

            let html = `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Secretaria Virtual</title>
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
                        <a href="/">Home</a>
                        <a href="/consulta_medica">Consultas Médicas</a>
                        <a href="/paciente">Visitas Médicas</a>
                        <a href="/receita_medica">Visualizar Receita Médica</a>
                    </nav>
                    <h1>Lista de Visitas Médicas</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Endereço</th>
                            <th>Data da Visita</th>
                            <th>Hora da Visita</th>
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
                                <td>${p.visit_date ?? ''}</td>
                                <td>${p.visit_time ?? ''}</td>
                            </tr>`;
                        });
            html += `</table>
                        </body>
            </html>`;
            res.send(html);
        }
        catch (error) {
            console.error('Erro ao buscar dados:', error);
            res.status(StatusCode.DatabaseError).send('Erro ao buscar pacientes.');
        }
    }

    private async getReceita_medica(req: Request, res: Response) {
        try {
            const query = `SELECT id_medicamento, nome_paciente, nome_medicamento, DATE_FORMAT(data_prescricao, '%d/%M/%Y') as data_prescricao, dosagem, frequencia, duracao, observacoes, nome_medico FROM vw_receitas_detalhadas;`;
            const [rows] = await this.connection.query(query);

            const receitas = rows as Array<{
                id_medicamento: number;
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
                    <title>Receitas Médicas</title>
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
                        <a href="/">Home</a>
                        <a href="/consulta_medica">Consultas Médicas</a>
                        <a href="/paciente">Lista de Pacientes</a>
                        <a href="/receita_medica">Visualizar Receita Médica</a>
                    </nav>
                    <h1>Receitas Médicas</h1>
                    <table>
                        <tr>
                            <th>ID da Receita Médica</th>
                            <th>Nome do Paciente</th>
                            <th>Data da Prescrição</th>
                            <th>Nome do Medicamento</th>
                            <th>Dosagem</th>
                            <th>Frequência</th>
                            <th>Duração</th>
                            <th>Observações</th>
                            <th>Nome do Médico</th>
                        </tr>`;
                        receitas.forEach((r) => {
                            html += `
                            <tr>
                                <td>${r.id_medicamento}</td>
                                <td>${r.nome_paciente}</td>
                                <td>${r.data_prescricao ?? ''}</td>
                                <td>${r.nome_medicamento}</td>
                                <td>${r.dosagem}</td>
                                <td>${r.frequencia}</td>
                                <td>${r.duracao}</td>
                                <td>${r.observacoes ?? ''}</td>
                                <td>${r.nome_medico}</td>
                            </tr>`;
                        });
            html += `</table>
                        </body>
            </html>`;
            res.send(html);
        }
        catch (error) {
            console.error('Erro ao buscar dados:', error);
            res.status(StatusCode.DatabaseError).send('Erro ao buscar pacientes.');
        }
    }

    private async generateReportRoute(req: Request, res: Response) {
        await this.generateReport();
        res.send('Relatório gerado com sucesso!');
        res.redirect('/');
    }

    private async generateReport() {
        // Mesma lógica do código anterior para JSON, HTML e PDF
    }

    private async initialize() {

        try{
            await this.connectToDatabase();

            this.connection.query(
                'CALL conclude_appointment()'
            );
    
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
                process.exit(StatusCode.ExitSuccess);
            });
        }
        catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            process.exit(StatusCode.ExitFail);
        }
    }

    private async checkPortAvailability() {
        return new Promise<void>((resolve, reject) => {
            const server = net.createServer((socket: any) => {
                console.log('Cliente conectado');
            
                // Escutar dados recebidos
                socket.on('data', (data: any) => {
                console.log('Recebido:', data.toString());
                socket.write('Mensagem recebida com sucesso!');
                });
            
                // Quando o cliente se desconectar
                socket.on('end', () => {
                console.log('Cliente desconectado');
                });
            
                // Tratamento de erros
                socket.on('error', (err: any) => {
                console.error('Erro:', err);
                });
            });
        });
    }

    private getKey(){
        return this.key;
    }
    private getValue(){
        return this.value;
    }

    private setKey(key: string){
        this.key = key;
    }
    private setValue(value: string){
        this.value = value;
    }
}

function runPowerShellScriptInThread(scriptPath: string, params: Record<string, string | number>) {
    if (isMainThread) {
        // Cria uma nova thread para executar o script PowerShell
        const worker = new Worker(__filename, {
            workerData: { scriptPath, params }
        });

        worker.on('message', (message) => {
            console.log('Saída do PowerShell:\n', message);
        });

        worker.on('error', (error) => {
            console.error(`Erro na execução da thread: ${error.message}`);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`A thread terminou com erro (código: ${code})`);
            }
        });
    } else {
        // Código que será executado na thread
        const { scriptPath, params } = workerData;

        // Aqui, fazemos uma simulação de execução do PowerShell.
        // Substitua esse código por sua lógica interna para rodar PowerShell sem `child_process`.
        const args = Object.entries(params).map(([key, value]) => `-${key} "${value}"`).join(" ");
        const simulatedOutput = `Simulando execução de PowerShell com o script: ${scriptPath} e parâmetros: ${args}`;
        
        // Passa a saída para o thread principal
        parentPort?.postMessage(simulatedOutput);
    }
}

new Server(3000);