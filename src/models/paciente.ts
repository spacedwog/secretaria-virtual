export class Paciente {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    data_nascimento: Date;

    constructor(id: number, nome: string, telefone: string, email: string, data_nascimento: Date) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.data_nascimento = data_nascimento;
    }
}