"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarReceita = void 0;
const express_1 = require("express");
const database_1 = require("../database/database"); // Configuração do banco de dados
const pdfkit_1 = __importDefault(require("pdfkit"));
const router = (0, express_1.Router)();
// Função para lidar com a rota de forma isolada
const gerarReceita = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const idReceita = parseInt(req.params.id);
    try {
        // Buscar dados da receita
        const receita = yield database_1.Database.query(`
            SELECT r.*, p.nome AS paciente, m.nome AS medico, m.crm
            FROM receitas_medicas r
            JOIN pacientes p ON r.id_paciente = p.id_paciente
            JOIN medicos m ON r.id_medico = m.id_medico
            WHERE r.id_receita = $1
        `, [idReceita]);
        const medicamentos = yield database_1.Database.query(`
            SELECT nome_medicamento, dosagem, frequencia, duracao
            FROM medicamentos_receita
            WHERE id_receita = $1
        `, [idReceita]);
        if (!receita.rows.length) {
            res.status(404).send('Receita não encontrada.');
            return;
        }
        // Gerar PDF
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
        doc.fontSize(16).text('Receita Médica', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Paciente: ${receita.rows[0].paciente}`);
        doc.text(`Médico: ${receita.rows[0].medico} (CRM: ${receita.rows[0].crm})`);
        doc.text(`Data: ${new Date(receita.rows[0].data_prescricao).toLocaleDateString()}`);
        doc.moveDown();
        doc.text('Medicamentos:', { underline: true });
        medicamentos.rows.forEach((med, index) => {
            doc.text(`${index + 1}. ${med.nome_medicamento}`);
            doc.text(`   - Dosagem: ${med.dosagem}`);
            doc.text(`   - Frequência: ${med.frequencia}`);
            doc.text(`   - Duração: ${med.duracao}`);
            doc.moveDown(0.5);
        });
        doc.moveDown();
        doc.text(`Observações: ${receita.rows[0].observacoes || 'Nenhuma'}`);
        doc.end();
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.gerarReceita = gerarReceita;
// Adicionar a rota ao roteador
router.get('/receitas/:id', exports.gerarReceita);
exports.default = router;
