import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise';
import cors from 'cors';

class Server {
    private app: Express;
    private port: number;
    private dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '6z2h1j3k9F!',
        database: 'secretaria_virtual',
    };
    private connection!: Connection;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        // Configura middlewares
        this.setupMiddlewares();

        // Define rotas
        this.setupRoutes();

        // Conecta ao banco de dados e inicia o servidor
        this.initialize();
    }

    private setupMiddlewares(): void {
        this.app.use(express.json()); // Permite entrada de dados JSON
        this.app.use(cors()); // Permite requisições de outros domínios
    }

    private setupRoutes(): void {
        // Rota principal
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Servidor rodando e pronto para receber entradas!');
        });

        // Rota para listar dados do banco
        this.app.get('/dados', this.getData.bind(this));

        // Rota para receber e processar dados via POST
        this.app.post('/entrada', (req, res) => this.handleInput(req, res));
    }

    private async connectToDatabase(): Promise<void> {
        try {
            this.connection = await mysql.createConnection(this.dbConfig);
            console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados MySQL:', error);
            process.exit(1);
        }
    }

    private async getData(req: Request, res: Response): Promise<void> {
        try {
            const [rows] = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
        }
    }

    private async handleInput(req: Request, res: Response): Promise<void> {
        const inputData = req.body;

        // Validação básica
        if (!inputData || Object.keys(inputData).length === 0) {
            res.status(400).json({ error: 'Nenhum dado recebido' });
            return;
        }

        console.log('Dados recebidos:', inputData);

        // Aqui, você pode implementar a lógica para salvar, processar ou manipular os dados recebidos.
        try {
            const {
                nome_paciente,
                nome_medico,
                data_prescricao,
                observacoes,
                nome_medicamento,
                dosagem,
                frequencia,
                duracao,
            } = inputData;

            const query = `
                INSERT INTO receitas (nome_paciente, nome_medico, data_prescricao, observacoes, nome_medicamento, dosagem, frequencia, duracao)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await this.connection.query(query, [
                nome_paciente,
                nome_medico,
                data_prescricao,
                observacoes,
                nome_medicamento,
                dosagem,
                frequencia,
                duracao,
            ]);

            res.status(201).json({ message: 'Dados inseridos com sucesso!' });
        } catch (error) {
            console.error('Erro ao processar dados:', error);
            res.status(500).json({ error: 'Erro ao processar dados recebidos' });
        }
    }

    private async initialize(): Promise<void> {
        await this.connectToDatabase();

        const startServer = () => {
            this.app
                .listen(this.port, () => {
                    console.log(`Servidor está rodando em http://localhost:${this.port}`);
                })
                .on('error', (err: NodeJS.ErrnoException) => {
                    if (err.code === 'EADDRINUSE') {
                        console.error(`Porta ${this.port} já está em uso. Tentando a próxima porta...`);
                        this.port += 1;
                        startServer();
                    } else {
                        console.error('Erro ao iniciar o servidor:', err);
                    }
                });
        };

        startServer();
    }
}

// Cria e inicia o servidor
new Server(3000);