import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise'; // Importa a versão Promise do mysql2

const app = express();
const PORT = 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',              // Host do banco de dados
    user: 'root',                   // Substitua pelo seu usuário do banco
    password: '6z2h1j3k9F!',        // Senha do banco de dados
    database: 'secretaria_virtual', // Nome do banco de dados
};

// Cria uma conexão com o banco de dados
let connection: mysql.Connection;

const connectToDatabase = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados MySQL:', error);
        process.exit(1); // Sai do processo caso a conexão falhe
    }
};

// Rota para testar consulta ao banco
app.get('/dados', async (req: Request, res: Response) => {
    try {
        const [rows] = await connection.query('SELECT * FROM vw_receitas_detalhadas'); // Substitua pelo nome da sua tabela
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
});

// Rota principal
app.get('/', (req: Request, res: Response) => {
    res.send('Servidor rodando em TypeScript com MySQL!');
});

// Inicia o servidor após conectar ao banco
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor está rodando em http://localhost:${PORT}`);
    });
});