import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Função para executar comandos Git
const executeGitCommand = (command: string) => {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar comando: ${stderr}`);
        reject(stderr);
        return;
      }
      console.log(`Comando executado com sucesso: ${stdout}`);
      resolve();
    });
  });
};

// Rota principal que salva e envia dados ao Git
app.post('/save-to-git', async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Mensagem não fornecida!');
  }

  const filePath = './response.txt';

  try {
    // Salva a resposta em um arquivo
    fs.writeFileSync(filePath, message);

    // Executa comandos Git
    await executeGitCommand('git add response.txt');
    await executeGitCommand(`git commit -m "Atualiza resposta: ${message.slice(0, 20)}..."`);
    await executeGitCommand('git push');

    res.status(200).send('Resposta salva e enviada ao Git!');
  } catch (error) {
    res.status(500).send(`Erro ao salvar ou enviar ao Git: ${error}`);
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});