import { Router, Request, Response, NextFunction } from 'express';
import { Database } from '../database/database'; // Configuração do banco de dados
import PDFDocument from 'pdfkit';

const router = Router();

// Função para lidar com a rota de forma isolada
export const gerarReceita = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const idReceita = parseInt(req.params.id);

    try {
        // Buscar dados da receita
        const receita = await Database.query(`
            SELECT r.*, p.nome AS paciente, m.nome AS medico, m.crm
            FROM receitas_medicas r
            JOIN pacientes p ON r.id_paciente = p.id_paciente
            JOIN medicos m ON r.id_medico = m.id_medico
            WHERE r.id_receita = $1
        `, [idReceita]);

        const medicamentos = await Database.query(`
            SELECT nome_medicamento, dosagem, frequencia, duracao
            FROM medicamentos_receita
            WHERE id_receita = $1
        `, [idReceita]);

        if (!receita.rows.length) {
            res.status(404).send('Receita não encontrada.');
            return;
        }

        // Gerar PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(16).text('Receita Médica', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Paciente: ${receita.rows[0].paciente}`);
        doc.text(`Médico: ${receita.rows[0].medico} (CRM: ${receita.rows[0].crm})`);
        doc.text(`Data: ${new Date(receita.rows[0].data_prescricao).toLocaleDateString()}`);
        doc.moveDown();
        doc.text('Medicamentos:', { underline: true });
        medicamentos.rows.forEach((med: any, index: number) => {
            doc.text(`${index + 1}. ${med.nome_medicamento}`);
            doc.text(`   - Dosagem: ${med.dosagem}`);
            doc.text(`   - Frequência: ${med.frequencia}`);
            doc.text(`   - Duração: ${med.duracao}`);
            doc.moveDown(0.5);
        });

        doc.moveDown();
        doc.text(`Observações: ${receita.rows[0].observacoes || 'Nenhuma'}`);
        doc.end();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Adicionar a rota ao roteador
router.get('/receitas/:id', gerarReceita);

export default router;