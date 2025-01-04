export class Funcionario {
    id: number;
    nome: string;
    cargo: string;
    salario: number;

    constructor(id: number, nome: string, cargo: string, salario: number) {
        this.id = id;
        this.nome = nome;
        this.cargo = cargo;
        this.salario = salario;
    }
}