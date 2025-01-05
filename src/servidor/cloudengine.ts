import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Rota principal
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor local em TypeScript funcionando!');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});