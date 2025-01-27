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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
var database_1 = require("./database");
var RecipDetails = /** @class */ (function () {
    function RecipDetails(patientId, doctorId, codeMed, recipId, medicamentoId, dataMed, observacao, medicationName, medicationType, frequencia, dosagem, consumo) {
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
    return RecipDetails;
}());
var DoctorService = /** @class */ (function () {
    function DoctorService() {
    }
    Object.defineProperty(DoctorService, "databaseInstance", {
        // Getter para inicializar e acessar a instância do Database
        get: function () {
            if (!this._databaseInstance) {
                this._databaseInstance = new database_1.Database();
            }
            return this._databaseInstance;
        },
        // Setter caso precise atualizar a instância do Database (se necessário)
        set: function (database) {
            this._databaseInstance = database;
        },
        enumerable: false,
        configurable: true
    });
    DoctorService.appoitmentView = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 1:
                        _a.sent(); // Alterado para chamar o método estático diretamente
                        return [4 /*yield*/, database_1.Database.query("SELECT * FROM patient_appointments_view")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error listing appointments:', error_1);
                        throw new Error('Failed to list appointments. Please try again later.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DoctorService.addDoctor = function (name, phone, email, speciality) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 1:
                        _a.sent(); // Alterado para chamar o método estático diretamente
                        return [4 /*yield*/, database_1.Database.query('CALL add_doctor(?, ?, ?, ?)', [name, speciality, phone, email])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error adding doctor:', error_2);
                        throw new Error('Failed to add doctor. Please check the input data and try again.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DoctorService.visitDoctor = function (patientId, doctorId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, date, time, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 1:
                        _a.sent(); // Alterado para chamar o método estático diretamente
                        currentDate = new Date();
                        date = "".concat(currentDate.getFullYear(), "-").concat(currentDate.getMonth() + 1, "-").concat(currentDate.getDate());
                        time = "".concat(currentDate.getHours(), ":").concat(currentDate.getMinutes());
                        return [4 /*yield*/, database_1.Database.query('CALL visit_doctor(?, ?, ?, ?)', [date, time, patientId, doctorId])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error visiting doctor:', error_3);
                        throw new Error('Failed to visit doctor. Please check the input data and try again.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DoctorService.recordSchedule = function (patient_id, doctor_id, date, time, reason, status, nome_consulta_medica) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 1:
                        _a.sent(); // Alterado para chamar o método estático diretamente
                        return [4 /*yield*/, database_1.Database.query('CALL make_appointment(?, ?, ?, ?, ?, ?, ?)', [date, time, reason, status, patient_id, doctor_id, nome_consulta_medica])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error recording schedule:', error_4);
                        throw new Error('Failed to record schedule. Please check the input data and try again.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DoctorService.medicRecip = function (recipDetails) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, doctorId, codeMed, receitaId, medicamentoId, dataMed, observation, nomeMedicamento, tipoMedicamento, frequency, dosage, consume, code_medicamento, id_paciente, id_medico, data_prescricao, observacao, id_receita, id_medicamento, nome_medicamento, tipo_medicamento, frequencia, dosagem, duracao, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        patientId = recipDetails.patientId, doctorId = recipDetails.doctorId, codeMed = recipDetails.codeMed, receitaId = recipDetails.receitaId, medicamentoId = recipDetails.medicamentoId, dataMed = recipDetails.dataMed, observation = recipDetails.observation, nomeMedicamento = recipDetails.nomeMedicamento, tipoMedicamento = recipDetails.tipoMedicamento, frequency = recipDetails.frequency, dosage = recipDetails.dosage, consume = recipDetails.consume;
                        code_medicamento = codeMed;
                        id_paciente = patientId;
                        id_medico = doctorId;
                        data_prescricao = dataMed.toString().split('T')[0];
                        observacao = observation;
                        id_receita = receitaId;
                        id_medicamento = medicamentoId;
                        nome_medicamento = nomeMedicamento;
                        tipo_medicamento = tipoMedicamento;
                        frequencia = frequency;
                        dosagem = dosage;
                        duracao = consume;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 2:
                        _a.sent(); // Alterado para chamar o método estático diretamente
                        return [4 /*yield*/, database_1.Database.query('CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [code_medicamento, id_paciente, id_medico, data_prescricao, observacao, id_receita, id_medicamento, nome_medicamento, tipo_medicamento, dosagem, frequencia, duracao])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Error adding medication:', error_5);
                        throw new Error('Failed to add medication. Please check the input data and try again.');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DoctorService.printMedicRecip = function (id_medicamento) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 1:
                        _a.sent(); // Alterado para chamar o método estático diretamente
                        return [4 /*yield*/, database_1.Database.query('SELECT * FROM vw_receitas_detalhadas WHERE id_medicamento = ?', [id_medicamento])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error printing medication:', error_6);
                        throw new Error('Failed to print medication. Please check the input data and try again.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DoctorService;
}());
exports.DoctorService = DoctorService;
