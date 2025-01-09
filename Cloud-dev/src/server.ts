import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise'; // Importa a versão Promise do mysql2
import readlineSync from 'readline-sync';
import axios from 'axios'; // Importa o axios para fazer requisições HTTP

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
        this.app.use(express.json()); // Para entender requisições JSON
    }

    private setupRoutes() {
        // Rota principal
        this.app.get('/', async (req: Request, res: Response) => {
            try {
                // Faz uma requisição interna à rota /dados
                const response = await axios.get('http://localhost:3000/dados');

                // Passa os dados da resposta para a página inicial
                res.status(200).json({
                    message: 'Dados recebidos com sucesso!',
                    dados: response.data
                });
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                res.status(500).json({ error: 'Erro ao buscar dados' });
            }
        });

        // Rota para testar consulta ao banco
        this.app.get('/dados', this.getData.bind(this));
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
        
        this.app.listen(this.port, () => {
            console.log(`Servidor está rodando em http://localhost:${this.port}`);
        });
        
    }

    // Getters e Setters para outras propriedades
    // (omiti os getters e setters por serem os mesmos do código anterior)

}

// Cria e inicia o servidor
new Server(3000);