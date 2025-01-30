var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Database } from './database';
class RecipDetails {
    constructor(patientId, doctorId, codeMed, recipId, medicamentoId, dataMed, observacao, medicationName, medicationType, frequencia, dosagem, consumo) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.codeMed = codeMed;
        this.receitaId = recipId;
        this.medicamentoId = medicamentoId;
        this.dataMed = dataMed;
        this.observation = observacao;
        this.nomeMedicamento = medicationName;
        this.tipoMedicamento = medicationType;
        this.frequency = frequencia;
        this.dosage = dosagem;
        this.consume = consumo;
    }
}
export class DoctorService {
    // Getter para inicializar e acessar a instância do Database
    static get databaseInstance() {
        if (!this._databaseInstance) {
            this._databaseInstance = new Database();
        }
        return this._databaseInstance;
    }
    // Setter caso precise atualizar a instância do Database (se necessário)
    static set databaseInstance(database) {
        this._databaseInstance = database;
    }
    static appoitmentView() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Database.init(); // Alterado para chamar o método estático diretamente
                const result = yield Database.query("SELECT * FROM patient_appointments_view");
                return result;
            }
            catch (error) {
                console.error('Error listing appointments:', error);
                throw new Error('Failed to list appointments. Please try again later.');
            }
        });
    }
    static addDoctor(name, phone, email, speciality) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Database.init(); // Alterado para chamar o método estático diretamente
                yield Database.query('CALL add_doctor(?, ?, ?, ?)', [name, speciality, phone, email]);
            }
            catch (error) {
                console.error('Error adding doctor:', error);
                throw new Error('Failed to add doctor. Please check the input data and try again.');
            }
        });
    }
    static visitDoctor(patientId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Database.init(); // Alterado para chamar o método estático diretamente
                const currentDate = new Date();
                const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
                const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
                yield Database.query('CALL visit_doctor(?, ?, ?, ?)', [date, time, patientId, doctorId]);
            }
            catch (error) {
                console.error('Error visiting doctor:', error);
                throw new Error('Failed to visit doctor. Please check the input data and try again.');
            }
        });
    }
    static recordSchedule(patient_id, doctor_id, date, time, reason, status, nome_consulta_medica) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Database.init(); // Alterado para chamar o método estático diretamente
                yield Database.query('CALL make_appointment(?, ?, ?, ?, ?, ?, ?)', [date, time, reason, status, patient_id, doctor_id, nome_consulta_medica]);
            }
            catch (error) {
                console.error('Error recording schedule:', error);
                throw new Error('Failed to record schedule. Please check the input data and try again.');
            }
        });
    }
    static medicRecip(recipDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { patientId, doctorId, codeMed, receitaId, medicamentoId, dataMed, observation, nomeMedicamento, tipoMedicamento, frequency, dosage, consume } = recipDetails;
            const code_medicamento = codeMed;
            const id_paciente = patientId;
            const id_medico = doctorId;
            const data_prescricao = dataMed.toString().split('T')[0];
            const observacao = observation;
            const id_receita = receitaId;
            const id_medicamento = medicamentoId;
            const nome_medicamento = nomeMedicamento;
            const tipo_medicamento = tipoMedicamento;
            const frequencia = frequency;
            const dosagem = dosage;
            const duracao = consume;
            try {
                yield Database.init(); // Alterado para chamar o método estático diretamente
                yield Database.query('CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [code_medicamento, id_paciente, id_medico, data_prescricao, observacao, id_receita, id_medicamento, nome_medicamento, tipo_medicamento, dosagem, frequencia, duracao]);
            }
            catch (error) {
                console.error('Error adding medication:', error);
                throw new Error('Failed to add medication. Please check the input data and try again.');
            }
        });
    }
    static printMedicRecip(id_medicamento) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Database.init(); // Alterado para chamar o método estático diretamente
                const result = yield Database.query('SELECT * FROM vw_receitas_detalhadas WHERE id_medicamento = ?', [id_medicamento]);
                return result;
            }
            catch (error) {
                console.error('Error printing medication:', error);
                throw new Error('Failed to print medication. Please check the input data and try again.');
            }
        });
    }
}
