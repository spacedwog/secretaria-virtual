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
                const result = yield database_1.Database.query("SELECT * FROM patient_appointments_view");
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
                yield database_1.Database.init(); // Certifique-se de inicializar a conexão
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
                yield database_1.Database.init(); // Certifique-se de inicializar a conexão
                const ano = new Date().getFullYear();
                const mes = new Date().getMonth();
                const dia = new Date().getDay();
                const date = ano + '-' + mes + '-' + dia;
                const time = new Date().getHours() + ':' + new Date().getMinutes();
                yield database_1.Database.query('INSERT INTO patients_doctors (patient_id, doctor_id, visit_date, visit_time) VALUES (?, ?, ?, ?)', [patientId, doctorId, date, time]);
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
                yield database_1.Database.init(); // Certifique-se de inicializar a conexão
                yield database_1.Database.query('INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)', [patient_id, doctor_id, date, time, reason, status]);
            }
            catch (error) {
                console.error('Error adding doctor:', error);
                throw new Error('Failed to add doctor. Please check the input data and try again.');
            }
        });
    }
}
exports.DoctorService = DoctorService;
