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
var net = require("net");
var path = require("path");
var dotenv = require("dotenv");
var mysql = require("mysql2/promise");
var express_1 = require("express");
var bodyParser = require("body-parser");
dotenv.config();
var Server = /** @class */ (function () {
    function Server(port) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.dbConfig = {
            host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost',
            user: (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : 'root',
            password: (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : '6z2h1j3k9F!',
            database: (_d = process.env.DB_NAME) !== null && _d !== void 0 ? _d : 'secretaria_virtual',
            connectTimeout: 10000,
        };
        this.dbRemidConfig = {
            host: (_e = process.env.DB_REMID_HOST) !== null && _e !== void 0 ? _e : 'localhost',
            user: (_f = process.env.DB_REMID_USER) !== null && _f !== void 0 ? _f : 'root',
            password: (_g = process.env.DB_REMID_PASSWORD) !== null && _g !== void 0 ? _g : '6z2h1j3k9F!',
            database: (_h = process.env.DB_REMID_NAME) !== null && _h !== void 0 ? _h : 'gerenciamentomedicamentos',
            connectTimeout: 10000,
        };
        this.tipo_medicamento = "";
        this.code_medicamento = "";
        this.app = (0, express_1.default)();
        this.port = port;
        this.setupMiddlewares();
        this.setupRoutes();
        this.initialize();
    }
    Server.prototype.setupMiddlewares = function () {
        var _this = this;
        // Middleware para parsear o corpo das requisições como JSON
        this.app.use(bodyParser.json());
        // Middleware para parse de JSON e form data
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Middleware para logar as requisições
        this.app.use(function (req, res, next) {
            console.log("[".concat(new Date().toISOString(), "] ").concat(req.method, " ").concat(req.url, " - User-Agent: ").concat(req.headers['user-agent']));
            next();
        });
        // Middleware para servir arquivos estáticos
        var staticPath = path.join(__dirname, 'public');
        this.app.use(express_1.default.static(staticPath));
        // Middleware para configurar headers (ex.: CORS)
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        // Middleware para tratar erros genéricos
        this.app.use(function (err, req, res, next) {
            console.error('Erro no middleware:', err);
            res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
        });
        // Endpoint para receber os dados do Python
        this.app.post('/receive-data', function (req, res) {
            var data = req.body;
            console.log("Dados recebidos da Blackboard:", data);
            // Acessando os valores dentro de `data` (o JSON enviado do Python)
            for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                console.log("Chave: ".concat(key, ", Valor: ").concat(value));
                _this.setTipo_medicamento(key);
                _this.setCode_medicamento("" + value);
            }
            // Aqui você pode processar os dados conforme necessário
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });
    };
    Server.prototype.setupRoutes = function () {
        var _this = this;
        this.app.get('/', this.viewMedicInfo.bind(this));
        this.app.get('/paciente', this.getPacientes.bind(this));
        this.app.get('/consulta_medica', this.viewWebsite.bind(this));
        this.app.get('/receita_medica', this.getReceita_medica.bind(this));
        this.app.get('/gerar-relatorio', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.generateReport()];
                    case 1:
                        _a.sent();
                        res.redirect('/'); // Redireciona diretamente
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Erro ao gerar relatório:', error_1);
                        res.status(500).send('Erro ao gerar relatório.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Server.prototype.connectToDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, mysql.createConnection(this.dbConfig)];
                    case 1:
                        _a.connection = _b.sent();
                        console.log('Conexão com o banco de dados estabelecida!');
                        this.pingInterval = setInterval(function () {
                            _this.connection.ping().then(function () { return console.log('Ping ao banco de dados.'); }).catch(console.error);
                        }, 10000);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Erro ao conectar ao banco de dados:', error_2);
                        process.exit(1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.viewMedicInfo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tipo_medicamento, code_medicamento, select, tabela, condicao, query, rows, medicamento, html_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tipo_medicamento = this.getTipo_medicamento().toString();
                        code_medicamento = this.getCode_medicamento().toString();
                        select = "SELECT * ";
                        tabela = "FROM medicamento_info ";
                        condicao = "";
                        if (tipo_medicamento != "" || code_medicamento != "") {
                            condicao = "WHERE tipo_do_medicamento = '" + tipo_medicamento + "' AND med_code = '" + code_medicamento + "' ";
                        }
                        query = select + tabela + condicao;
                        console.log(query);
                        return [4 /*yield*/, this.connection.query(query)];
                    case 1:
                        rows = (_a.sent())[0];
                        medicamento = rows;
                        html_1 = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                    <head>\n                        <meta charset=\"UTF-8\">\n                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                        <title>Secretaria Virtual</title>\n                        <style>\n                            table { width: 100%; border-collapse: collapse; }\n                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                            th { background-color: #0078d4; color: white; }\n                            tr:nth-child(even) { background-color: #f2f2f2; }\n                            body {\n                                font-family: Arial, sans-serif;\n                                margin: 0;\n                                padding: 0;\n                                background-color: #f5f5f5;\n                                color: #333;\n                            }\n                            header {\n                                background-color: #0078d4;\n                                color: white;\n                                padding: 1rem;\n                                text-align: center;\n                            }\n                            nav {\n                                display: flex;\n                                justify-content: center;\n                                background-color: #005bb5;\n                                padding: 0.5rem;\n                            }\n                            nav a {\n                                color: white;\n                                text-decoration: none;\n                                margin: 0 1rem;\n                                font-weight: bold;\n                            }\n                            nav a:hover {\n                                text-decoration: underline;\n                            }\n                            main {\n                                padding: 2rem;\n                                max-width: 800px;\n                                margin: auto;\n                                background-color: white;\n                                border-radius: 8px;\n                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                            }\n                            form {\n                                display: flex;\n                                flex-direction: column;\n                            }\n                            form label {\n                                margin: 0.5rem 0 0.2rem;\n                            }\n                            form input, form select, form textarea, form button {\n                                padding: 0.8rem;\n                                margin-bottom: 1rem;\n                                border: 1px solid #ccc;\n                                border-radius: 4px;\n                            }\n                            form button {\n                                background-color: #0078d4;\n                                color: white;\n                                border: none;\n                                cursor: pointer;\n                            }\n                            form button:hover {\n                                background-color: #005bb5;\n                            }\n                            footer {\n                                text-align: center;\n                                padding: 1rem;\n                                background-color: #0078d4;\n                                color: white;\n                                margin-top: 2rem;\n                            }\n                        </style>\n                    </head>\n                    <body>\n                        <header>\n                            <h1>Secret\u00E1ria Virtual</h1>\n                            <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                        </header>\n                        <nav>\n                            <a href=\"/\">Home</a>\n                            <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                            <a href=\"/paciente\">Lista de Pacientes</a>\n                            <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                        </nav>\n                        <h1>Informa\u00E7\u00F5es do Medicamento</h1>\n                        <table>\n                            <tr>\n                                <th>C\u00F3digo do Medicamento</th>\n                                <th>Nome do Medicamento</th>\n                                <th>Tipo do Medicamento</th>\n                                <th>Dosagem do Medicamento</th>\n                                <th>Frequencia de Administra\u00E7\u00E3o</th>\n                                <th>Dura\u00E7\u00E3o da Administra\u00E7\u00E3o</th>\n                                <th>Observa\u00E7\u00F5es do Medicamento</th>\n                                <th>Data da Prescri\u00E7\u00E3o</th>\n                            </tr>";
                        medicamento.forEach(function (m) {
                            html_1 += "\n                                <tr>\n                                    <td>".concat(m.med_code, "</td>\n                                    <td>").concat(m.nome_do_medicamento, "</td>\n                                    <td>").concat(m.tipo_do_medicamento, "</td>\n                                    <td>").concat(m.dosagem_do_medicamento, "</td>\n                                    <td>").concat(m.frequencia_de_administracao, "</td>\n                                    <td>").concat(m.duracao_da_administracao, "</td>\n                                    <td>").concat(m.observacoes_do_medicamento, "</td>\n                                    <td>").concat(m.data_da_prescricao, "</td>\n                                </tr>");
                        });
                        html_1 += "\n                        </table>\n                    </body>\n                </html>";
                        res.send(html_1);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Erro ao executar consulta:', error_3);
                        res.status(500).send('Erro ao carregar dados.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.viewWebsite = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, appointment, html_2, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT nome_consulta_medica, patient_name, DATE_FORMAT(appointment_date, '%d/%M/%Y') as appointment_date, appointment_time, status, doctor_name FROM patient_appointments_view;";
                        return [4 /*yield*/, this.connection.query(query)];
                    case 1:
                        rows = (_a.sent())[0];
                        appointment = rows;
                        html_2 = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                    <head>\n                        <meta charset=\"UTF-8\">\n                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                        <title>Secretaria Virtual</title>\n                        <style>\n                            table { width: 100%; border-collapse: collapse; }\n                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                            th { background-color: #0078d4; color: white; }\n                            tr:nth-child(even) { background-color: #f2f2f2; }\n                            body {\n                                font-family: Arial, sans-serif;\n                                margin: 0;\n                                padding: 0;\n                                background-color: #f5f5f5;\n                                color: #333;\n                            }\n                            header {\n                                background-color: #0078d4;\n                                color: white;\n                                padding: 1rem;\n                                text-align: center;\n                            }\n                            nav {\n                                display: flex;\n                                justify-content: center;\n                                background-color: #005bb5;\n                                padding: 0.5rem;\n                            }\n                            nav a {\n                                color: white;\n                                text-decoration: none;\n                                margin: 0 1rem;\n                                font-weight: bold;\n                            }\n                            nav a:hover {\n                                text-decoration: underline;\n                            }\n                            main {\n                                padding: 2rem;\n                                max-width: 800px;\n                                margin: auto;\n                                background-color: white;\n                                border-radius: 8px;\n                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                            }\n                            form {\n                                display: flex;\n                                flex-direction: column;\n                            }\n                            form label {\n                                margin: 0.5rem 0 0.2rem;\n                            }\n                            form input, form select, form textarea, form button {\n                                padding: 0.8rem;\n                                margin-bottom: 1rem;\n                                border: 1px solid #ccc;\n                                border-radius: 4px;\n                            }\n                            form button {\n                                background-color: #0078d4;\n                                color: white;\n                                border: none;\n                                cursor: pointer;\n                            }\n                            form button:hover {\n                                background-color: #005bb5;\n                            }\n                            footer {\n                                text-align: center;\n                                padding: 1rem;\n                                background-color: #0078d4;\n                                color: white;\n                                margin-top: 2rem;\n                            }\n                        </style>\n                    </head>\n                    <body>\n                        <header>\n                            <h1>Secret\u00E1ria Virtual</h1>\n                            <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                        </header>\n                        <nav>\n                            <a href=\"/\">Home</a>\n                            <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                            <a href=\"/paciente\">Lista de Pacientes</a>\n                            <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                        </nav>\n                        <h1>Consultas M\u00E9dicas</h1>\n                        <table>\n                            <tr>\n                                <th>consulta m\u00E9dica</th>\n                                <th>Nome do Paciente</th>\n                                <th>Data da Consulta</th>\n                                <th>Hora da Consulta</th>\n                                <th>Status da Consulta M\u00E9dica</th>\n                                <th>Nome do Doutor</th>\n                            </tr>";
                        appointment.forEach(function (a) {
                            html_2 += "\n                                <tr>\n                                    <td>".concat(a.nome_consulta_medica, "</td>\n                                    <td>").concat(a.patient_name, "</td>\n                                    <td>").concat(a.appointment_date, "</td>\n                                    <td>").concat(a.appointment_time, "</td>\n                                    <td>").concat(a.status, "</td>\n                                    <td>").concat(a.doctor_name, "</td>\n                                </tr>");
                        });
                        html_2 += "\n                        </table>\n                    </body>\n                </html>";
                        res.send(html_2);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Erro ao executar consulta:', error_4);
                        res.status(500).send('Erro ao carregar dados.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.getPacientes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, pacientes, html_3, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT * from pacient_view;";
                        return [4 /*yield*/, this.connection.query(query)];
                    case 1:
                        rows = (_a.sent())[0];
                        pacientes = rows;
                        html_3 = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                    <title>Secretaria Virtual</title>\n                    <style>\n                        table { width: 100%; border-collapse: collapse; }\n                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                        th { background-color: #0078d4; color: white; }\n                        tr:nth-child(even) { background-color: #f2f2f2; }\n                        body {\n                            font-family: Arial, sans-serif;\n                            margin: 0;\n                            padding: 0;\n                            background-color: #f5f5f5;\n                            color: #333;\n                        }\n                        header {\n                            background-color: #0078d4;\n                            color: white;\n                            padding: 1rem;\n                            text-align: center;\n                        }\n                        nav {\n                            display: flex;\n                            justify-content: center;\n                            background-color: #005bb5;\n                            padding: 0.5rem;\n                        }\n                        nav a {\n                            color: white;\n                            text-decoration: none;\n                            margin: 0 1rem;\n                            font-weight: bold;\n                        }\n                        nav a:hover {\n                            text-decoration: underline;\n                        }\n                        main {\n                            padding: 2rem;\n                            max-width: 800px;\n                            margin: auto;\n                            background-color: white;\n                            border-radius: 8px;\n                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                        }\n                        form {\n                            display: flex;\n                            flex-direction: column;\n                        }\n                        form label {\n                            margin: 0.5rem 0 0.2rem;\n                        }\n                        form input, form select, form textarea, form button {\n                            padding: 0.8rem;\n                            margin-bottom: 1rem;\n                            border: 1px solid #ccc;\n                            border-radius: 4px;\n                        }\n                        form button {\n                            background-color: #0078d4;\n                            color: white;\n                            border: none;\n                            cursor: pointer;\n                        }\n                        form button:hover {\n                            background-color: #005bb5;\n                        }\n                        footer {\n                            text-align: center;\n                            padding: 1rem;\n                            background-color: #0078d4;\n                            color: white;\n                            margin-top: 2rem;\n                        }\n                    </style>\n                </head>\n                <body>\n                    <header>\n                        <h1>Secret\u00E1ria Virtual</h1>\n                        <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                    </header>\n                    <nav>\n                        <a href=\"/\">Home</a>\n                        <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                        <a href=\"/paciente\">Lista de Pacientes</a>\n                        <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                    </nav>\n                    <h1>Lista de Pacientes</h1>\n                    <table>\n                        <tr>\n                            <th>ID</th>\n                            <th>Nome</th>\n                            <th>Idade</th>\n                            <th>Telefone</th>\n                            <th>Email</th>\n                            <th>Endere\u00E7o</th>\n                            <th>Data da Visita</th>\n                            <th>Hora da Visita</th>\n                        </tr>";
                        pacientes.forEach(function (p) {
                            var _a, _b, _c;
                            html_3 += "\n                            <tr>\n                                <td>".concat(p.patient_id, "</td>\n                                <td>").concat(p.name, "</td>\n                                <td>").concat(p.age, "</td>\n                                <td>").concat(p.phone, "</td>\n                                <td>").concat(p.email, "</td>\n                                <td>").concat((_a = p.address) !== null && _a !== void 0 ? _a : '', "</td>\n                                <td>").concat((_b = p.visit_date) !== null && _b !== void 0 ? _b : '', "</td>\n                                <td>").concat((_c = p.visit_time) !== null && _c !== void 0 ? _c : '', "</td>\n                            </tr>");
                        });
                        html_3 += "</table>\n                        </body>\n            </html>";
                        res.send(html_3);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Erro ao buscar dados:', error_5);
                        res.status(500).send('Erro ao buscar pacientes.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.getReceita_medica = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, receitas, html_4, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT id_medicamento, nome_paciente, nome_medicamento, DATE_FORMAT(data_prescricao, '%d/%M/%Y') as data_prescricao, dosagem, frequencia, duracao, observacoes, nome_medico FROM vw_receitas_detalhadas;";
                        return [4 /*yield*/, this.connection.query(query)];
                    case 1:
                        rows = (_a.sent())[0];
                        receitas = rows;
                        html_4 = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                    <title>Receitas M\u00E9dicas</title>\n                    <style>\n                        table { width: 100%; border-collapse: collapse; }\n                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                        th { background-color: #0078d4; color: white; }\n                        tr:nth-child(even) { background-color: #f2f2f2; }\n                        body {\n                            font-family: Arial, sans-serif;\n                            margin: 0;\n                            padding: 0;\n                            background-color: #f5f5f5;\n                            color: #333;\n                        }\n                        header {\n                            background-color: #0078d4;\n                            color: white;\n                            padding: 1rem;\n                            text-align: center;\n                        }\n                        nav {\n                            display: flex;\n                            justify-content: center;\n                            background-color: #005bb5;\n                            padding: 0.5rem;\n                        }\n                        nav a {\n                            color: white;\n                            text-decoration: none;\n                            margin: 0 1rem;\n                            font-weight: bold;\n                        }\n                        nav a:hover {\n                            text-decoration: underline;\n                        }\n                        main {\n                            padding: 2rem;\n                            max-width: 800px;\n                            margin: auto;\n                            background-color: white;\n                            border-radius: 8px;\n                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                        }\n                        form {\n                            display: flex;\n                            flex-direction: column;\n                        }\n                        form label {\n                            margin: 0.5rem 0 0.2rem;\n                        }\n                        form input, form select, form textarea, form button {\n                            padding: 0.8rem;\n                            margin-bottom: 1rem;\n                            border: 1px solid #ccc;\n                            border-radius: 4px;\n                        }\n                        form button {\n                            background-color: #0078d4;\n                            color: white;\n                            border: none;\n                            cursor: pointer;\n                        }\n                        form button:hover {\n                            background-color: #005bb5;\n                        }\n                        footer {\n                            text-align: center;\n                            padding: 1rem;\n                            background-color: #0078d4;\n                            color: white;\n                            margin-top: 2rem;\n                        }\n                    </style>\n                </head>\n                <body>\n                    <header>\n                        <h1>Secret\u00E1ria Virtual</h1>\n                        <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                    </header>\n                    <nav>\n                        <a href=\"/\">Home</a>\n                        <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                        <a href=\"/paciente\">Lista de Pacientes</a>\n                        <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                    </nav>\n                    <h1>Receitas M\u00E9dicas</h1>\n                    <table>\n                        <tr>\n                            <th>ID da Receita M\u00E9dica</th>\n                            <th>Nome do Paciente</th>\n                            <th>Data da Prescri\u00E7\u00E3o</th>\n                            <th>Nome do Medicamento</th>\n                            <th>Dosagem</th>\n                            <th>Frequ\u00EAncia</th>\n                            <th>Dura\u00E7\u00E3o</th>\n                            <th>Observa\u00E7\u00F5es</th>\n                            <th>Nome do M\u00E9dico</th>\n                        </tr>";
                        receitas.forEach(function (r) {
                            var _a, _b;
                            html_4 += "\n                            <tr>\n                                <td>".concat(r.id_medicamento, "</td>\n                                <td>").concat(r.nome_paciente, "</td>\n                                <td>").concat((_a = r.data_prescricao) !== null && _a !== void 0 ? _a : '', "</td>\n                                <td>").concat(r.nome_medicamento, "</td>\n                                <td>").concat(r.dosagem, "</td>\n                                <td>").concat(r.frequencia, "</td>\n                                <td>").concat(r.duracao, "</td>\n                                <td>").concat((_b = r.observacoes) !== null && _b !== void 0 ? _b : '', "</td>\n                                <td>").concat(r.nome_medico, "</td>\n                            </tr>");
                        });
                        html_4 += "</table>\n                        </body>\n            </html>";
                        res.send(html_4);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Erro ao buscar dados:', error_6);
                        res.status(500).send('Erro ao buscar pacientes.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.generateReportRoute = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateReport()];
                    case 1:
                        _a.sent();
                        res.send('Relatório gerado com sucesso!');
                        res.redirect('/');
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.generateReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startServer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectToDatabase()];
                    case 1:
                        _a.sent();
                        startServer = function (port) {
                            _this.app.listen(port, function () {
                                console.log("Servidor rodando na porta ".concat(port));
                            }).on('error', function (err) {
                                if (err.code === 'EADDRINUSE') {
                                    console.error("Porta ".concat(port, " j\u00E1 est\u00E1 em uso."));
                                    var alternativePort = port + 1;
                                    console.log("Tentando porta alternativa ".concat(alternativePort, "..."));
                                    startServer(alternativePort);
                                }
                                else {
                                    throw err;
                                }
                            });
                        };
                        startServer(this.port);
                        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('\nEncerrando servidor...');
                                        clearInterval(this.pingInterval);
                                        return [4 /*yield*/, this.connection.end()];
                                    case 1:
                                        _a.sent();
                                        console.log('Conexão com o banco de dados encerrada.');
                                        process.exit(0);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.checkPortAvailability = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var server = net.createServer();
                        server.once('error', function (err) {
                            if (err.code === 'EADDRINUSE') {
                                console.error("A porta ".concat(_this.port, " j\u00E1 est\u00E1 em uso."));
                                reject(err);
                            }
                        });
                        server.once('listening', function () {
                            server.close();
                            resolve();
                        });
                        server.listen(_this.port);
                    })];
            });
        });
    };
    Server.prototype.getTipo_medicamento = function () {
        return this.tipo_medicamento;
    };
    Server.prototype.getCode_medicamento = function () {
        return this.code_medicamento;
    };
    Server.prototype.setTipo_medicamento = function (tipo_medicamento) {
        this.tipo_medicamento = tipo_medicamento;
    };
    Server.prototype.setCode_medicamento = function (code_medicamento) {
        this.code_medicamento = code_medicamento;
    };
    return Server;
}());
new Server(3000);
