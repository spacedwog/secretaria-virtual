import { Request, Response, NextFunction } from 'express';
import { gerarReceita } from '../routes/receitas';

class ImpressaoController {
    async imprimirReceita(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
        try {
            // Chamar a função de geração de receita
            await gerarReceita(req, res, next);
        } catch (error) {
            console.error('Erro ao imprimir a receita:', error);
            next(error);
        }
    }
}

export const impressaoController = new ImpressaoController();