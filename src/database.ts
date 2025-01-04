import mysql from 'mysql2';

// Criando conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'secretaria_virtual'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro na conexão com o banco de dados:', err);
        return;
    }
    console.log('Conexão estabelecida com o banco de dados');
});

export default connection;