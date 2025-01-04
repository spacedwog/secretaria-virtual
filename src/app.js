"use strict";
// src/app.ts
Object.defineProperty(exports, "__esModule", { value: true });
const menu_1 = require("./utils/menu"); // Importa a classe SecretariaVirtual
// Criando uma instância da classe
const secretaria = new menu_1.SecretariaVirtual();
// Exibindo o menu para interação com o usuário
secretaria.exibirMenu();
// Usando os métodos de inserir paciente, agendar consulta e exibir relatórios
// Você pode utilizar os métodos após a criação da instância de secretaria
// Exemplo de uso dos métodos da classe SecretariaVirtual:
secretaria.setNome('João Silva');
secretaria.setTelefone('123456789');
secretaria.setEmail('joao@example.com');
secretaria.setDataNascimento('1980-12-01');
secretaria.inserirPaciente();
secretaria.setPacienteId(1);
secretaria.setDataConsulta('2025-01-10');
secretaria.agendarConsulta();
secretaria.exibirRelatorios();
