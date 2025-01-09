import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise'; // Importa a versão Promise do mysql2
import cors from 'cors'; // Para permitir requisições de outros domínios (como o app React Native)

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

    private setupMiddlewares() {
        this.app.use(express.json()); // Para processar requisições JSON
        this.app.use(cors()); // Permitir requisições de outros domínios
    }

    private setupRoutes() {
        // Rota principal
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Servidor rodando e pronto para receber requisições!');
        });

        // Rota para retornar dados do banco
        this.app.get('/dados', this.getData.bind(this));

        // Rota para adicionar dados ao banco
        this.app.post('/adicionar', this.addData.bind(this));

        // Rota para atualizar dados no banco
        this.app.put('/atualizar/:id', this.updateData.bind(this));

        // Rota para deletar dados no banco
        this.app.delete('/deletar/:id', this.deleteData.bind(this));
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
            const [rows] = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
        }
    }

    private async addData(req: Request, res: Response) {
        const { nome_paciente, nome_medico, data_prescricao, observacoes, nome_medicamento, dosagem, frequencia, duracao } = req.body;

        try {
            const result = await this.connection.query(
                `INSERT INTO receitas (nome_paciente, nome_medico, data_prescricao, observacoes, nome_medicamento, dosagem, frequencia, duracao) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [nome_paciente, nome_medico, data_prescricao, observacoes, nome_medicamento, dosagem, frequencia, duracao]
            );
            res.status(201).json({ message: 'Dados inseridos com sucesso!', result });
        } catch (error) {
            console.error('Erro ao adicionar dados ao banco de dados:', error);
            res.status(500).json({ error: 'Erro ao adicionar dados ao banco de dados' });
        }
    }

    private async updateData(req: Request, res: Response) {
        const { id } = req.params;
        const { nome_paciente, nome_medico, data_prescricao, observacoes, nome_medicamento, dosagem, frequencia, duracao } = req.body;

        try {
            const result = await this.connection.query(
                `UPDATE receitas SET nome_paciente = ?, nome_medico = ?, data_prescricao = ?, observacoes = ?, nome_medicamento = ?, dosagem = ?, frequencia = ?, duracao = ? WHERE id = ?`,
                [nome_paciente, nome_medico, data_prescricao, observacoes, nome_medicamento, dosagem, frequencia, duracao, id]
            );
            res.status(200).json({ message: 'Dados atualizados com sucesso!', result });
        } catch (error) {
            console.error('Erro ao atualizar dados no banco de dados:', error);
            res.status(500).json({ error: 'Erro ao atualizar dados no banco de dados' });
        }
    }

    private async deleteData(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const result = await this.connection.query(
                `DELETE FROM receitas WHERE id = ?`,
                [id]
            );
            res.status(200).json({ message: 'Dados deletados com sucesso!', result });
        } catch (error) {
            console.error('Erro ao deletar dados do banco de dados:', error);
            res.status(500).json({ error: 'Erro ao deletar dados do banco de dados' });
        }
    }

    private async initialize() {
        await this.connectToDatabase();
        this.app.listen(this.port, () => {
            console.log(`Servidor está rodando em http://localhost:${this.port}`);
        });
    }
}

// Cria e inicia o servidor
new Server(3000);