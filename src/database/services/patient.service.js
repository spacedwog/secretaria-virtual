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
const database_1 = require("../database");
class PatientService {
    static listPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.Database.query('SELECT * FROM patients');
        });
    }
    static addPatient(name, age, phone, email, address) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.Database.query('INSERT INTO patients (name, age, phone, email, address) VALUES ($1, $2, $3, $4, $5)', [name, age, phone, email, address]);
        });
    }
    static editPatient(patientId, fieldsToUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const columns = Object.keys(fieldsToUpdate);
            const values = Object.values(fieldsToUpdate);
            const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
            const query = `UPDATE patients SET ${setClause} WHERE patient_id = $${columns.length + 1}`;
            yield database_1.Database.query(query, [...values, patientId]);
        });
    }
    static deletePatient(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.Database.query('DELETE FROM patients WHERE patient_id = $1', [patientId]);
        });
    }
}
exports.PatientService = PatientService;
