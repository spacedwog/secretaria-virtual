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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
var database_1 = require("./database");
var PatientService = /** @class */ (function () {
    function PatientService() {
    }
    PatientService.listPatients = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.Database.init()];
                    case 1:
                        _a.sent(); // Certifique-se de inicializar a conexão
                        return [4 /*yield*/, database_1.Database.query("SELECT * FROM patients")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result]; // O MySQL retornará os dados no formato esperado
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error listing patients:', error_1);
                        throw new Error('Failed to list patients. Please try again later.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PatientService.addPatient = function (name, age, phone, email, address) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        database_1.Database.init(); // Certifique-se de inicializar a conexão
                        return [4 /*yield*/, database_1.Database.query('CALL add_patient(?, ?, ?, ?, ?)', [name, age, phone, email, address])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error adding patient:', error_2);
                        throw new Error('Failed to add patient. Please check the input data and try again.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PatientService.editPatient = function (patientId, fieldsToUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, values, setClause, query, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        columns = Object.keys(fieldsToUpdate);
                        values = Object.values(fieldsToUpdate);
                        if (columns.length === 0) {
                            throw new Error('No fields provided for update.');
                        }
                        setClause = columns.map(function (col) { return "".concat(col, " = ?"); }).join(', ');
                        query = "UPDATE patients SET ".concat(setClause, " WHERE patient_id = ?");
                        console.log('Executing query:', query);
                        return [4 /*yield*/, database_1.Database.query(query, __spreadArray(__spreadArray([], values, true), [patientId], false))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error editing patient:', error_3);
                        throw new Error('Failed to edit patient. Please check the input data and try again.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PatientService.deletePatient = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.Database.query('DELETE FROM patients WHERE patient_id = ?', [patientId])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error deleting patient:', error_4);
                        throw new Error('Failed to delete patient. Please try again later.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PatientService;
}());
exports.PatientService = PatientService;
