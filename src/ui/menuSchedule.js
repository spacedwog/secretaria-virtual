"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Classe para exibir o menu de consulta médica
class menuSchedule {
    display() {
        console.clear();
        console.log("===== Consulta Médica =====");
        console.log("1. Voltar ao Menu Principal");
        console.log("2. Exibir Mensagem");
        const choice = this.getUserChoice();
        switch (choice) {
            case "1":
                console.log("Retornando ao Menu Principal...");
                break;
            case "2":
                console.log("Mensagem exibida com sucesso!");
                this.display(); // Permanece no submenu
                break;
            default:
                console.log("Opção inválida. Tente novamente.");
                this.display(); // Reinicia o submenu
        }
    }
    getUserChoice() {
        const prompt = require("prompt-sync")();
        return prompt("Escolha uma opção: ");
    }
}
