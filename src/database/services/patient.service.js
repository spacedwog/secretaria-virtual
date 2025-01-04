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
exports.getAllPatients = getAllPatients;
exports.createPatient = createPatient;
const database_1 = require("../database/database");
function getAllPatients() {
    return __awaiter(this, void 0, void 0, function* () {
        const patients = yield (0, database_1.query)('SELECT * FROM patients');
        return patients;
    });
}
function createPatient(patient) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, database_1.query)('INSERT INTO patients (name, age, phone, email, appointment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [patient.name, patient.age, patient.phone, patient.email, patient.appointmentDate]);
        return result[0];
    });
}
