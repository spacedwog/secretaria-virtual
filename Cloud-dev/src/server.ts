import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise'; // Importa a versão Promise do mysql2

class Server {
    private app: Express;
    private port: number;
    private dbConfig = {
        host: 'localhost',              // Host do banco de dados
        user: 'root',                   // Substitua pelo seu usuário do banco
        password: '6z2h1j3k9F!',        // Senha do banco de dados
        database: 'secretaria_virtual', // Nome do banco de dados
    };
    private connection!: Connection;

    private nome_paciente: string;
    private nome_medico: string;
    private data_prescricao: string;
    private observacao: string;
    private nome_medicamento: string;
    private dosagem: string;
    private frequencia: string;
    private duracao: string;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.nome_paciente = "";
        this.nome_medico = "";
        this.data_prescricao = "";
        this.observacao = "";
        this.nome_medicamento = "";
        this.dosagem = "";
        this.frequencia = "";
        this.duracao = "";

        // Configura middlewares
        this.setupMiddlewares();

        // Define rotas
        this.setupRoutes();

        // Conecta ao banco de dados e inicia o servidor
        this.initialize();
    }

    private setupMiddlewares() {
        this.app.use(express.json()); // Para entender requisições JSON
    }

    private setupRoutes() {
        // Rota principal
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Servidor rodando em TypeScript com MySQL!');
        });

        // Rota para testar consulta ao banco
        this.app.get('/dados', this.getData.bind(this));

        // Rota para receber dados via POST e settar nas variáveis
        this.app.post('/setDados', (req: Request, res: Response) => {
            const dados = req.body; // Array de objetos

            // Verifica se o corpo da requisição é um array
            if (Array.isArray(dados)) {
                // Itera sobre cada item do array e usa os setters
                dados.forEach(item => {
                    this.setNome_paciente(item.nome_paciente);
                    this.setNome_medico(item.nome_medico);
                    this.setData_prescricao(item.data_prescricao);
                    this.setObservacao(item.observacoes);
                    this.setNome_medicamento(item.nome_medicamento);
                    this.setDosagem(item.dosagem);
                    this.setFrequencia(item.frequencia);
                    this.setDuracao(item.duracao);
                });

                res.status(200).json({
                    message: 'Dados atualizados com sucesso!',
                    data: dados
                });
                console.log("Nome do Paciente: " + this.getNome_paciente());
            } else {
                res.status(400).json({
                    error: 'O corpo da requisição deve ser um array de objetos'
                });
            }
        });
    }

    private async connectToDatabase() {
        try {
            this.connection = await mysql.createConnection(this.dbConfig);
            console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados MySQL:', error);
            process.exit(1); // Sai do processo caso a conexão falhe
        }
    }

    private async getData(req: Request, res: Response) {
        try {
            const [rows] = await this.connection.query('SELECT * FROM vw_receitas_detalhadas'); // Ajuste conforme necessário
            res.status(200).json(rows);
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
        }
    }

    private async initialize() {
        await this.connectToDatabase();
        this.app.listen(this.port, () => {
            console.log(`Servidor está rodando em http://localhost:${this.port}`);
        });
    }

    // Getters
    public getNome_paciente(): string {
        return this.nome_paciente;
    }

    public getNome_medico(): string {
        return this.nome_medico;
    }

    public getData_prescricao(): string {
        return this.data_prescricao;
    }

    public getObservacao(): string {
        return this.observacao;
    }

    public getNome_medicamento(): string {
        return this.nome_medicamento;
    }

    public getDosagem(): string {
        return this.dosagem;
    }

    public getFrequencia(): string {
        return this.frequencia;
    }

    public getDuracao(): string {
        return this.duracao;
    }

    // Setters
    public setNome_paciente(nome_paciente: string): void {
        this.nome_paciente = nome_paciente;
    }

    public setNome_medico(nome_medico: string): void {
        this.nome_medico = nome_medico;
    }

    public setData_prescricao(data_prescricao: string): void {
        this.data_prescricao = data_prescricao;
    }

    public setObservacao(observacao: string): void {
        this.observacao = observacao;
    }

    public setNome_medicamento(nome_medicamento: string): void {
        this.nome_medicamento = nome_medicamento;
    }

    public setDosagem(dosagem: string): void {
        this.dosagem = dosagem;
    }

    public setFrequencia(frequencia: string): void {
        this.frequencia = frequencia;
    }

    public setDuracao(duracao: string): void {
        this.duracao = duracao;
    }
}

// Cria e inicia o servidor
new Server(3000);