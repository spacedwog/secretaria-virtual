export class Consulta {
    id: number;
    id_paciente: number;
    data_consulta: Date;
    horario: string;
    status: string;

    constructor(id: number, id_paciente: number, data_consulta: Date, horario: string, status: string) {
        this.id = id;
        this.id_paciente = id_paciente;
        this.data_consulta = data_consulta;
        this.horario = horario;
        this.status = status;
    }
}