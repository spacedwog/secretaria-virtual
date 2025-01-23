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
exports.ETLProcess = void 0;
var patient_service_1 = require("../Back-end/patient.service");
var ETLProcess = /** @class */ (function () {
    function ETLProcess() {
        this.patientId = 0;
        this.patientAge = 0;
        this.patientName = "";
        this.patientPhone = "";
        this.patientEmail = "";
        this.patientAddress = "";
        this.cartaoCadastro = "";
    }
    ETLProcess.prototype.gerarCartaoPaciente = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Gerando Cartão de Paciente');
                        return [4 /*yield*/, this.extractDataPacient()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ETLProcess.prototype.extractDataPacient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patients, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Extraindo Dados do Banco de Dados');
                        return [4 /*yield*/, patient_service_1.PatientService.listPatients()];
                    case 1:
                        patients = _a.sent();
                        patients.forEach(function (patient) {
                            _this.setPatientId(patient.patient_id);
                            _this.setPatientName(patient.name);
                            _this.setPatientAge(patient.age);
                            _this.setPatientPhone(patient.phone);
                            _this.setPatientEmail(patient.email);
                            _this.setPatientAddress(patient.address);
                            _this.transformDataPacient();
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Erro ao listar pacientes:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ETLProcess.prototype.transformDataPacient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id_paciente, nome_paciente, idade_paciente, email_paciente, telefone_paciente, endereco_paciente;
            return __generator(this, function (_a) {
                console.log('Transformando Dados');
                id_paciente = this.getPatientId();
                nome_paciente = this.getPatientName();
                idade_paciente = this.getPatientAge();
                email_paciente = this.getPatientEmail();
                telefone_paciente = this.getPatientPhone();
                endereco_paciente = this.getPatientAddress();
                this.setCartaoCadastro("ID: " + id_paciente + "\nO Paciente: " + nome_paciente + " foi cadastrado no sistema" +
                    "\nDados do Paciente: " +
                    "\n Nome: " + nome_paciente + " Idade: " + idade_paciente +
                    "\n Telefone: " + telefone_paciente + " Email: " + email_paciente +
                    "\n Endereco: " + endereco_paciente);
                this.loadDataPacient();
                return [2 /*return*/];
            });
        });
    };
    ETLProcess.prototype.loadDataPacient = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Carregando Dados para o Sistema');
                // Implementar a carga dos dados para o sistema
                // Exemplo: Salvar no banco de dados, gravar em um arquivo, etc.
                console.log('Cartão de Cadastro: ', this.getCartaoCadastro());
                console.log('Cartão de Cadastro Salvo com Sucesso');
                return [2 /*return*/];
            });
        });
    };
    ETLProcess.prototype.getPatientId = function () {
        return this.patientId;
    };
    ETLProcess.prototype.getPatientName = function () {
        return this.patientName;
    };
    ETLProcess.prototype.getPatientAge = function () {
        return this.patientAge;
    };
    ETLProcess.prototype.getPatientPhone = function () {
        return this.patientPhone;
    };
    ETLProcess.prototype.getPatientEmail = function () {
        return this.patientEmail;
    };
    ETLProcess.prototype.getPatientAddress = function () {
        return this.patientAddress;
    };
    ETLProcess.prototype.getCartaoCadastro = function () {
        return this.cartaoCadastro;
    };
    ETLProcess.prototype.setPatientId = function (patient_id) {
        this.patientId = patient_id;
    };
    ETLProcess.prototype.setPatientName = function (name) {
        this.patientName = name;
    };
    ETLProcess.prototype.setPatientAge = function (age) {
        this.patientAge = age;
    };
    ETLProcess.prototype.setPatientPhone = function (phone) {
        this.patientPhone = phone;
    };
    ETLProcess.prototype.setPatientEmail = function (email) {
        this.patientEmail = email;
    };
    ETLProcess.prototype.setPatientAddress = function (address) {
        this.patientAddress = address;
    };
    ETLProcess.prototype.setCartaoCadastro = function (cartao_cadastro) {
        this.cartaoCadastro = cartao_cadastro;
    };
    return ETLProcess;
}());
exports.ETLProcess = ETLProcess;
