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
exports.DoctorService = void 0;
const database_1 = require("./database");
class DoctorService {
    // Getter para inicializar e acessar a instância do Database
    static get databaseInstance() {
        if (!this._databaseInstance) {
            this._databaseInstance = new database_1.Database();
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
                yield database_1.Database.init(); // Alterado para chamar o método estático diretamente
                const result = yield database_1.Database.query("SELECT * FROM patient_appointments_view");
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
                yield database_1.Database.init(); // Alterado para chamar o método estático diretamente
                yield database_1.Database.query('CALL add_doctor(?, ?, ?, ?)', [name, speciality, phone, email]);
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
                yield database_1.Database.init(); // Alterado para chamar o método estático diretamente
                const currentDate = new Date();
                const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
                const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
                yield database_1.Database.query('CALL visit_doctor(?, ?, ?, ?)', [date, time, patientId, doctorId]);
            }
            catch (error) {
                console.error('Error visiting doctor:', error);
                throw new Error('Failed to visit doctor. Please check the input data and try again.');
            }
        });
    }
    static recordSchedule(patient_id, doctor_id, date, time, reason, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.init(); // Alterado para chamar o método estático diretamente
                yield database_1.Database.query('CALL make_appointment(?, ?, ?, ?, ?, ?)', [date, time, reason, status, patient_id, doctor_id]);
            }
            catch (error) {
                console.error('Error recording schedule:', error);
                throw new Error('Failed to record schedule. Please check the input data and try again.');
            }
        });
    }
    static medicRecip(id_paciente, id_medico, id_receita, data_prescricao, observacao, nome_medicamento, frequencia, dosagem, duracao) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.init(); // Alterado para chamar o método estático diretamente
                yield database_1.Database.query('CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_paciente, id_medico, data_prescricao, observacao, id_receita, nome_medicamento, dosagem, frequencia, duracao]);
            }
            catch (error) {
                console.error('Error adding medication:', error);
                throw new Error('Failed to add medication. Please check the input data and try again.');
            }
        });
    }
    static printMedicRecip(id_receita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.init(); // Alterado para chamar o método estático diretamente
                const result = yield database_1.Database.query('SELECT * FROM vw_receitas_detalhadas WHERE id_receita = ?', [id_receita]);
                return result;
            }
            catch (error) {
                console.error('Error printing medication:', error);
                throw new Error('Failed to print medication. Please check the input data and try again.');
            }
        });
    }
}
exports.DoctorService = DoctorService;
