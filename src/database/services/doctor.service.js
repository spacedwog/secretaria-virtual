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
const database_1 = require("../database");
class DoctorService {
    static appoitmentView() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.init(); // Certifique-se de inicializar a conexão
                const result = yield database_1.Database.query("SELECT * FROM appointments");
                return result; // O MySQL retornará os dados no formato esperado
            }
            catch (error) {
                console.error('Error listing appoitments:', error);
                throw new Error('Failed to list appoitments. Please try again later.');
            }
        });
    }
    static addDoctor(name, phone, email, speciality) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.query('INSERT INTO doctors (name, phone, email, speciality) VALUES (?, ?, ?, ?)', [name, phone, email, speciality]);
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
                yield database_1.Database.query('INSERT INTO patients_doctors (patient_id, doctor_id) VALUES (?, ?)', [patientId, doctorId]);
            }
            catch (error) {
                console.error('Error visiting doctor:', error);
                throw new Error('Failed to visit doctor. Please check the input data and try again.');
            }
        });
    }
    static makeAppoitment(patientId, doctorId, appoitmentDate, appoitmentTime, reasonAppoiment, statusAppoiment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.Database.query('INSERT INTO appointments (patient_id, doctor_id, appoitment_date, appoitment_time, reason, status) VALUES (?,?,?,?)', [patientId, doctorId, appoitmentDate, appoitmentTime, reasonAppoiment, statusAppoiment]);
            }
            catch (error) {
                console.error('Error making appoitment:', error);
                throw new Error('Failed to make appoitment. Please check the input data and try again.');
            }
        });
    }
    static consultSchedule(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.Database.query('SELECT * FROM appointments WHERE patient_id = ?', [patientId]);
                return result;
            }
            catch (error) {
                console.error('Error deleting patient:', error);
                throw new Error('Failed to delete patient. Please try again later.');
            }
        });
    }
}
exports.DoctorService = DoctorService;
