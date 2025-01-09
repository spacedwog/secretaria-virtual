import express, { Request, Response, Express } from 'express';
import mysql, { Connection } from 'mysql2/promise';
import readlineSync from 'readline-sync';
import * as FileSystem from 'expo-file-system';
import { PDFDocument, StandardFonts } from 'pdf-lib';

class Server {
    private app: Express;
    private port: number;
    private dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '6z2h1j3k9F!',
        database: 'secretaria_virtual',
        connectTimeout: 10000,
    };
    private connection!: Connection;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.setupMiddlewares();
        this.setupRoutes();
        this.initialize();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
    }

    private setupRoutes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Servidor rodando em TypeScript com MySQL!');
        });

        this.app.get('/dados', this.getData.bind(this));
        this.app.get('/gerar-relatorio', async (req: Request, res: Response) => {
            await this.generateReport();
            res.send('Relatório gerado com sucesso!');
        });
    }

    private async connectToDatabase() {
        try {
            this.connection = await mysql.createConnection(this.dbConfig);
            console.log('Conexão com o banco de dados estabelecida!');
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            process.exit(1);
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

    private async generateReport() {
        try {
            const [rows]: any = await this.connection.query('SELECT * FROM vw_receitas_detalhadas');

            if (!rows.length) {
                console.log('Nenhum dado encontrado para o relatório.');
                return;
            }

            const jsonPath = `${FileSystem.documentDirectory}receita_medica.json`;
            const htmlPath = `${FileSystem.documentDirectory}receita_medica.html`;
            const pdfPath = `${FileSystem.documentDirectory}receita_medica.pdf`;

            // Gerar JSON
            await FileSystem.writeAsStringAsync(jsonPath, JSON.stringify(rows, null, 2));
            console.log(`Relatório JSON salvo em: ${jsonPath}`);

            // Gerar HTML
            const htmlContent = this.generateHTMLContent(rows);
            await FileSystem.writeAsStringAsync(htmlPath, htmlContent);
            console.log(`Relatório HTML salvo em: ${htmlPath}`);

            // Gerar PDF
            await this.generatePDF(rows, pdfPath);
            console.log(`Relatório PDF salvo em: ${pdfPath}`);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        }
    }

    private generateHTMLContent(rows: any[]): string {
        const tableRows = rows.map(row => `
            <tr>
                <td>${row.id_receita}</td>
                <td>${row.nome_paciente}</td>
                <td>${row.nome_medico}</td>
                <td>${row.data_prescricao}</td>
                <td>${row.observacoes}</td>
                <td>${row.nome_medicamento}</td>
                <td>${row.dosagem}</td>
                <td>${row.frequencia}</td>
                <td>${row.duracao}</td>
            </tr>`).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Relatório</title>
        </head>
        <body>
            <h1>Relatório de Receitas</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID Receita</th>
                        <th>Nome do Paciente</th>
                        <th>Nome do Médico</th>
                        <th>Data da Prescrição</th>
                        <th>Observações</th>
                        <th>Nome do Medicamento</th>
                        <th>Dosagem</th>
                        <th>Frequência</th>
                        <th>Duração</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>`;
    }

    private async generatePDF(rows: any[], filePath: string): Promise<void> {
        // Criação do documento PDF
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
        // Adicionar uma nova página ao PDF
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
    
        // Configurações de layout
        let yPosition = height - 50; // Margem superior
        const lineSpacing = 15;
    
        // Título do relatório
        page.drawText('Relatório de Receitas Médicas', {
            x: 50,
            y: yPosition,
            size: 18,
            font: timesRomanFont,
        });
    
        yPosition -= 30; // Ajustar posição após o título
    
        // Adicionar dados em formato estruturado
        rows.forEach((row, index) => {
            if (yPosition < 50) {
                // Adicionar nova página se o conteúdo ultrapassar os limites
                const newPage = pdfDoc.addPage();
                yPosition = height - 50;
            }
    
            page.drawText(`ID Receita: ${row.id_receita}`, {
                x: 50,
                y: yPosition,
                size: fontSize,
                font: timesRomanFont,
            });
            page.drawText(`Paciente: ${row.nome_paciente}`, {
                x: 50,
                y: yPosition - lineSpacing,
                size: fontSize,
                font: timesRomanFont,
            });
            page.drawText(`Médico: ${row.nome_medico}`, {
                x: 50,
                y: yPosition - 2 * lineSpacing,
                size: fontSize,
                font: timesRomanFont,
            });
            page.drawText(`Data Prescrição: ${row.data_prescricao}`, {
                x: 50,
                y: yPosition - 3 * lineSpacing,
                size: fontSize,
                font: timesRomanFont,
            });
            page.drawText(`Observações: ${row.observacoes}`, {
                x: 50,
                y: yPosition - 4 * lineSpacing,
                size: fontSize,
                font: timesRomanFont,
            });
    
            // Avançar posição para a próxima entrada
            yPosition -= 5 * lineSpacing;
        });
    
        // Salvar o PDF como Uint8Array
        const pdfBytes = await pdfDoc.save();
    
        // Converter Uint8Array para Base64
        const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    
        // Salvar o arquivo no sistema
        FileSystem.writeFileSync(filePath, base64Pdf, 'base64');
        console.log(`Relatório PDF salvo em: ${filePath}`);
    }

    private async showMenu(): Promise<void> {
        // Mantido como estava no código original
    }

    private async initialize() {
        await this.connectToDatabase();
        this.showMenu();
    }
}

new Server(3000);