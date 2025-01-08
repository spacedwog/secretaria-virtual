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
Object.defineProperty(exports, "__esModule", { value: true });
exports.impressaoController = void 0;
const receitas_1 = require("../routes/receitas");
class ImpressaoController {
    imprimirReceita(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Chamar a função de geração de receita
                yield (0, receitas_1.gerarReceita)(req, res, next);
            }
            catch (error) {
                console.error('Erro ao imprimir a receita:', error);
                next(error);
            }
        });
    }
}
exports.impressaoController = new ImpressaoController();
