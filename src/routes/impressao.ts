import { Router } from 'express';
import { impressaoController } from '../controllers/impressao';

const router = Router();

// Rota para imprimir a receita
router.get('/imprimir-receita/:id', (req, res, next) => {
    impressaoController.imprimirReceita(req, res, next);
});

export default router;