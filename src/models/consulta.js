"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consulta = void 0;
class Consulta {
    constructor(id, id_paciente, data_consulta, horario, status) {
        this.id = id;
        this.id_paciente = id_paciente;
        this.data_consulta = data_consulta;
        this.horario = horario;
        this.status = status;
    }
}
exports.Consulta = Consulta;
