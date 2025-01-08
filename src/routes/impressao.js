"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const impressao_1 = require("../controllers/impressao");
const router = (0, express_1.Router)();
// Rota para imprimir a receita
router.get('/imprimir-receita/:id', (req, res, next) => {
    impressao_1.impressaoController.imprimirReceita(req, res, next);
});
exports.default = router;
