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
exports.PatientService = void 0;
const database_1 = require("./database");
class PatientService {
    static listPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.init(); // Certifique-se de inicializar a conexão
                const result = yield database_1.Database.query("SELECT * FROM patients");
                return result; // O MySQL retornará os dados no formato esperado
            }
            catch (error) {
                console.error('Error listing patients:', error);
                throw new Error('Failed to list patients. Please try again later.');
            }
        });
    }
    static addPatient(name, age, phone, email, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.query('INSERT INTO patients (name, age, phone, email, address) VALUES (?, ?, ?, ?, ?)', [name, age, phone, email, address]);
            }
            catch (error) {
                console.error('Error adding patient:', error);
                throw new Error('Failed to add patient. Please check the input data and try again.');
            }
        });
    }
    static editPatient(patientId, fieldsToUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const columns = Object.keys(fieldsToUpdate);
                const values = Object.values(fieldsToUpdate);
                if (columns.length === 0) {
                    throw new Error('No fields provided for update.');
                }
                const setClause = columns.map((col) => `${col} = ?`).join(', ');
                const query = `UPDATE patients SET ${setClause} WHERE patient_id = ?`;
                console.log('Executing query:', query);
                yield database_1.Database.query(query, [...values, patientId]);
            }
            catch (error) {
                console.error('Error editing patient:', error);
                throw new Error('Failed to edit patient. Please check the input data and try again.');
            }
        });
    }
    static deletePatient(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.query('DELETE FROM patients WHERE patient_id = ?', [patientId]);
            }
            catch (error) {
                console.error('Error deleting patient:', error);
                throw new Error('Failed to delete patient. Please try again later.');
            }
        });
    }
}
exports.PatientService = PatientService;
