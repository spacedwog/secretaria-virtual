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
exports.Server = void 0;
var net_1 = require("net");
var path_1 = require("path");
var express_1 = require("express");
var dotenv = require("dotenv");
var url_1 = require("url");
var body_parser_1 = require("body-parser");
var worker_threads_1 = require("worker_threads");
dotenv.config();
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["ExitSuccess"] = 0] = "ExitSuccess";
    StatusCode[StatusCode["ExitFail"] = 1] = "ExitFail";
    StatusCode[StatusCode["DatabaseSuccess"] = 200] = "DatabaseSuccess";
    StatusCode[StatusCode["DatabaseError"] = 500] = "DatabaseError";
})(StatusCode || (StatusCode = {}));
var UPDATE_DATA_ENDPOINT = "/update-data";
var RECORD_DATA_ENDPOINT = "/record-data";
var SAVE_DATA_ENDPOINT = "/save-data";
var scriptPath = './cloudengine.ps1';
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var worker = new worker_threads_1.Worker(__filename); // Ou especifique outro arquivo
var Server = /** @class */ (function () {
    function Server(port) {
        this.key = "";
        this.value = "";
        this.app = (0, express_1.default)();
        this.port = port;
        this.setupMiddlewares();
        this.setupRoutes();
    }
    Server.prototype.setupMiddlewares = function () {
        // Middleware para parse de JSON e form data
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        //Middleware do tipo: Parse
        //Descrição: Serve para parsear o corpo das requisições como JSON
        this.app.use(body_parser_1.default.json());
        //Middleware do tipo: Log
        //Descrição: Serve para logar as requisições
        this.app.use(function (req, res, next) {
            console.log("[".concat(new Date().toISOString(), "] ").concat(req.method, " ").concat(req.url, " - User-Agent: ").concat(req.headers['user-agent']));
            next();
        });
        //Middleware do tipo: Join
        //Descrição: Serve para servir arquivos estáticos
        // Definir __filename e __dirname manualmente
        var __filename = (0, url_1.fileURLToPath)(import.meta.url);
        var __dirname = path_1.default.dirname(__filename);
        var staticPath = path_1.default.join(__dirname, 'public');
        this.app.use(express_1.default.static(staticPath));
        //Middleware do tipo: Config
        //Descrição: Serve para configurar headers (ex.: CORS)
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        //Middleware do tipo: Error
        //Descrição: Serve para tratar erros genéricos
        this.app.use(function (err, req, res, next) {
            console.error('Erro no middleware:', err);
            res.status(err.status || StatusCode.DatabaseError).json({ error: err.message || 'Erro interno do servidor' });
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
                        res.status(StatusCode.DatabaseError).send('Erro ao gerar relatório.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // Endpoint para receber dados do Python
        this.app.post(UPDATE_DATA_ENDPOINT, function (req, res) {
            var _a = req.body, key = _a.key, value = _a.value;
            if ((key && typeof key !== 'string') || (value && typeof value !== 'string')) {
                res.status(400).json({ message: 'Dados inválidos enviados!' });
            }
            console.log('Dados recebidos:', { key: key, value: value });
            _this.setKey(key);
            _this.setValue(value);
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });
        // Endpoint para receber dados do Python
        this.app.post(RECORD_DATA_ENDPOINT, function (req, res) {
            var _a = req.body, id_paciente = _a.id_paciente, id_medico = _a.id_medico, id_receita = _a.id_receita, code_medic = _a.code_medic, id_medic = _a.id_medic, nome_medic = _a.nome_medic, tipo_medic = _a.tipo_medic, data_medic = _a.data_medic, dosagem = _a.dosagem, frequencia = _a.frequencia, consumo = _a.consumo, observacao = _a.observacao;
            if ((id_paciente && typeof id_paciente !== 'number') ||
                (id_medico && typeof id_medico !== 'number') ||
                (id_receita && typeof id_receita !== 'number') ||
                (code_medic && typeof code_medic !== 'string') ||
                (id_medic && typeof id_medic !== 'number') ||
                (nome_medic && typeof nome_medic !== 'string') ||
                (tipo_medic && typeof tipo_medic !== 'string') ||
                (data_medic && typeof data_medic !== 'string') ||
                (dosagem && typeof dosagem !== 'number') ||
                (frequencia && typeof frequencia !== 'string') ||
                (consumo && typeof consumo !== 'string') ||
                (observacao && typeof observacao !== 'string')) {
                res.status(400).json({ message: 'Dados inválidos enviados!' });
            }
            console.log('Dados recebidos:', { id_paciente: id_paciente, id_medico: id_medico, id_receita: id_receita, code_medic: code_medic, id_medic: id_medic, nome_medic: nome_medic, tipo_medic: tipo_medic, data_medic: data_medic, dosagem: dosagem, frequencia: frequencia, consumo: consumo, observacao: observacao });
            var currentDate = new Date();
            var date = "".concat(currentDate.getFullYear(), "-").concat(currentDate.getMonth() + 1, "-").concat(currentDate.getDate());
            var time = "".concat(currentDate.getHours(), ":").concat(currentDate.getMinutes());
            /*this.connection.query(
                'CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [code_medic, id_paciente, id_medico, data_medic, observacao, id_receita, id_medic, nome_medic, tipo_medic, dosagem, frequencia, consumo, observacao]
            );

            this.connection.query(
                'CALL visit_doctor(?, ?, ?, ?)',
                [date, time, id_paciente, id_medico]
            );*/
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });
        // Endpoint para receber dados do Python
        this.app.post(SAVE_DATA_ENDPOINT, function (req, res) {
            var _a = req.body, id_paciente = _a.id_paciente, id_medico = _a.id_medico, nome_consulta_medica = _a.nome_consulta_medica, appointment_date = _a.appointment_date, appointment_time = _a.appointment_time, reason = _a.reason, status = _a.status;
            if ((id_paciente && typeof id_paciente !== 'number') ||
                (id_medico && typeof id_medico !== 'number') ||
                (nome_consulta_medica && typeof nome_consulta_medica !== 'string') ||
                (appointment_date && typeof appointment_date !== 'string') ||
                (appointment_time && typeof appointment_time !== 'string') ||
                (reason && typeof reason !== 'string') ||
                (status && typeof status !== 'string')) {
                res.status(400).json({ message: 'Dados inválidos enviados!' });
            }
            console.log('Dados recebidos:', { id_paciente: id_paciente, id_medico: id_medico, nome_consulta_medica: nome_consulta_medica, appointment_date: appointment_date, appointment_time: appointment_time, reason: reason, status: status });
            /*this.connection.query(
                'CALL make_appointment(?, ?, ?, ?, ?, ?, ?)',
                [appointment_date, appointment_time, reason, status, id_paciente, id_medico, nome_consulta_medica]
            );*/
            res.status(200).json({ message: 'Dados recebidos com sucesso!' });
        });
        this.initialize();
    };
    Server.prototype.connectToDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                try {
                    params = {
                        function: "connectToDatabase()",
                        mensagem: "Conexao com o banco de dados estabelecida!",
                        return_code: 0,
                        type_server: "typescript"
                    };
                    runPowerShellScriptInThread(scriptPath, params);
                    console.log('Conexão com o banco de dados estabelecida!');
                    /*this.pingInterval = setInterval(() => {
                        this.connection.ping().then(() => console.log('Ping ao banco de dados.')).catch(console.error);
                        
                    }, 10000);*/
                }
                catch (error) {
                    console.error('Erro ao conectar ao banco de dados:', error);
                    process.exit(StatusCode.ExitFail);
                }
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.viewMedicInfo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var css, html;
            return __generator(this, function (_a) {
                try {
                    css = "\n                        <style>\n                            table { width: 100%; border-collapse: collapse; }\n                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                            th { background-color: #0078d4; color: white; }\n                            tr:nth-child(even) { background-color: #f2f2f2; }\n                            body {\n                                font-family: Arial, sans-serif;\n                                margin: 0;\n                                padding: 0;\n                                background-color: #f5f5f5;\n                                color: #333;\n                            }\n                            header {\n                                background-color: #0078d4;\n                                color: white;\n                                padding: 1rem;\n                                text-align: center;\n                            }\n                            nav {\n                                display: flex;\n                                justify-content: center;\n                                background-color: #005bb5;\n                                padding: 0.5rem;\n                            }\n                            nav a {\n                                color: white;\n                                text-decoration: none;\n                                margin: 0 1rem;\n                                font-weight: bold;\n                            }\n                            nav a:hover {\n                                text-decoration: underline;\n                            }\n                            main {\n                                padding: 2rem;\n                                max-width: 800px;\n                                margin: auto;\n                                background-color: white;\n                                border-radius: 8px;\n                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                            }\n                            form {\n                                display: flex;\n                                flex-direction: column;\n                            }\n                            form label {\n                                margin: 0.5rem 0 0.2rem;\n                            }\n                            form input, form select, form textarea, form button {\n                                padding: 0.8rem;\n                                margin-bottom: 1rem;\n                                border: 1px solid #ccc;\n                                border-radius: 4px;\n                            }\n                            form button {\n                                background-color: #0078d4;\n                                color: white;\n                                border: none;\n                                cursor: pointer;\n                            }\n                            form button:hover {\n                                background-color: #005bb5;\n                            }\n                            footer {\n                                text-align: center;\n                                padding: 1rem;\n                                background-color: #0078d4;\n                                color: white;\n                                margin-top: 2rem;\n                            }\n                        </style>";
                    html = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                    <head>\n                        <meta charset=\"UTF-8\">\n                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                        <title>Secretaria Virtual</title>";
                    html += css;
                    html += "\n                    </head>\n                    <body>\n                        <header>\n                            <h1>Secret\u00E1ria Virtual</h1>\n                            <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                        </header>\n                        <nav>\n                            <a href=\"/\">Home</a>\n                            <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                            <a href=\"/paciente\">Visitas M\u00E9dicas</a>\n                            <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                        </nav>\n                        <h1>Informa\u00E7\u00F5es do Medicamento</h1>\n                        <table>\n                            <tr>\n                                <th>C\u00F3digo do Medicamento</th>\n                                <th>Nome do Medicamento</th>\n                                <th>Tipo do Medicamento</th>\n                                <th>Dosagem do Medicamento</th>\n                                <th>Frequencia de Administra\u00E7\u00E3o</th>\n                                <th>Dura\u00E7\u00E3o da Administra\u00E7\u00E3o</th>\n                                <th>Observa\u00E7\u00F5es do Medicamento</th>\n                                <th>Data da Prescri\u00E7\u00E3o</th>\n                            </tr>";
                    html += "\n                        </table>\n                    </body>\n                </html>";
                    res.send(html);
                }
                catch (error) {
                    console.error('Erro ao executar consulta:', error);
                    res.status(StatusCode.DatabaseError).send('Erro ao carregar dados.');
                }
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.viewWebsite = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                try {
                    html = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                    <head>\n                        <meta charset=\"UTF-8\">\n                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                        <title>Secretaria Virtual</title>\n                        <style>\n                            table { width: 100%; border-collapse: collapse; }\n                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                            th { background-color: #0078d4; color: white; }\n                            tr:nth-child(even) { background-color: #f2f2f2; }\n                            body {\n                                font-family: Arial, sans-serif;\n                                margin: 0;\n                                padding: 0;\n                                background-color: #f5f5f5;\n                                color: #333;\n                            }\n                            header {\n                                background-color: #0078d4;\n                                color: white;\n                                padding: 1rem;\n                                text-align: center;\n                            }\n                            nav {\n                                display: flex;\n                                justify-content: center;\n                                background-color: #005bb5;\n                                padding: 0.5rem;\n                            }\n                            nav a {\n                                color: white;\n                                text-decoration: none;\n                                margin: 0 1rem;\n                                font-weight: bold;\n                            }\n                            nav a:hover {\n                                text-decoration: underline;\n                            }\n                            main {\n                                padding: 2rem;\n                                max-width: 800px;\n                                margin: auto;\n                                background-color: white;\n                                border-radius: 8px;\n                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                            }\n                            form {\n                                display: flex;\n                                flex-direction: column;\n                            }\n                            form label {\n                                margin: 0.5rem 0 0.2rem;\n                            }\n                            form input, form select, form textarea, form button {\n                                padding: 0.8rem;\n                                margin-bottom: 1rem;\n                                border: 1px solid #ccc;\n                                border-radius: 4px;\n                            }\n                            form button {\n                                background-color: #0078d4;\n                                color: white;\n                                border: none;\n                                cursor: pointer;\n                            }\n                            form button:hover {\n                                background-color: #005bb5;\n                            }\n                            footer {\n                                text-align: center;\n                                padding: 1rem;\n                                background-color: #0078d4;\n                                color: white;\n                                margin-top: 2rem;\n                            }\n                        </style>\n                    </head>\n                    <body>\n                        <header>\n                            <h1>Secret\u00E1ria Virtual</h1>\n                            <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                        </header>\n                        <nav>\n                            <a href=\"/\">Home</a>\n                            <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                            <a href=\"/paciente\">Visitas M\u00E9dicas</a>\n                            <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                        </nav>\n                        <h1>Consultas M\u00E9dicas</h1>\n                        <table>\n                            <tr>\n                                <th>consulta m\u00E9dica</th>\n                                <th>Nome do Paciente</th>\n                                <th>Data da Consulta</th>\n                                <th>Hora da Consulta</th>\n                                <th>Status da Consulta M\u00E9dica</th>\n                                <th>Nome do Doutor</th>\n                            </tr>";
                    html += "\n                        </table>\n                    </body>\n                </html>";
                    res.send(html);
                }
                catch (error) {
                    console.error('Erro ao executar consulta:', error);
                    res.status(StatusCode.DatabaseError).send('Erro ao carregar dados.');
                }
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.getPacientes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                try {
                    html = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                    <title>Secretaria Virtual</title>\n                    <style>\n                        table { width: 100%; border-collapse: collapse; }\n                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                        th { background-color: #0078d4; color: white; }\n                        tr:nth-child(even) { background-color: #f2f2f2; }\n                        body {\n                            font-family: Arial, sans-serif;\n                            margin: 0;\n                            padding: 0;\n                            background-color: #f5f5f5;\n                            color: #333;\n                        }\n                        header {\n                            background-color: #0078d4;\n                            color: white;\n                            padding: 1rem;\n                            text-align: center;\n                        }\n                        nav {\n                            display: flex;\n                            justify-content: center;\n                            background-color: #005bb5;\n                            padding: 0.5rem;\n                        }\n                        nav a {\n                            color: white;\n                            text-decoration: none;\n                            margin: 0 1rem;\n                            font-weight: bold;\n                        }\n                        nav a:hover {\n                            text-decoration: underline;\n                        }\n                        main {\n                            padding: 2rem;\n                            max-width: 800px;\n                            margin: auto;\n                            background-color: white;\n                            border-radius: 8px;\n                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                        }\n                        form {\n                            display: flex;\n                            flex-direction: column;\n                        }\n                        form label {\n                            margin: 0.5rem 0 0.2rem;\n                        }\n                        form input, form select, form textarea, form button {\n                            padding: 0.8rem;\n                            margin-bottom: 1rem;\n                            border: 1px solid #ccc;\n                            border-radius: 4px;\n                        }\n                        form button {\n                            background-color: #0078d4;\n                            color: white;\n                            border: none;\n                            cursor: pointer;\n                        }\n                        form button:hover {\n                            background-color: #005bb5;\n                        }\n                        footer {\n                            text-align: center;\n                            padding: 1rem;\n                            background-color: #0078d4;\n                            color: white;\n                            margin-top: 2rem;\n                        }\n                    </style>\n                </head>\n                <body>\n                    <header>\n                        <h1>Secret\u00E1ria Virtual</h1>\n                        <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                    </header>\n                    <nav>\n                        <a href=\"/\">Home</a>\n                        <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                        <a href=\"/paciente\">Visitas M\u00E9dicas</a>\n                        <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                    </nav>\n                    <h1>Lista de Visitas M\u00E9dicas</h1>\n                    <table>\n                        <tr>\n                            <th>ID</th>\n                            <th>Nome</th>\n                            <th>Idade</th>\n                            <th>Telefone</th>\n                            <th>Email</th>\n                            <th>Endere\u00E7o</th>\n                            <th>Data da Visita</th>\n                            <th>Hora da Visita</th>\n                        </tr>";
                    html += "</table>\n                        </body>\n            </html>";
                    res.send(html);
                }
                catch (error) {
                    console.error('Erro ao buscar dados:', error);
                    res.status(StatusCode.DatabaseError).send('Erro ao buscar pacientes.');
                }
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.getReceita_medica = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                try {
                    html = "\n                <!DOCTYPE html>\n                <html lang=\"pt-br\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                    <title>Receitas M\u00E9dicas</title>\n                    <style>\n                        table { width: 100%; border-collapse: collapse; }\n                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n                        th { background-color: #0078d4; color: white; }\n                        tr:nth-child(even) { background-color: #f2f2f2; }\n                        body {\n                            font-family: Arial, sans-serif;\n                            margin: 0;\n                            padding: 0;\n                            background-color: #f5f5f5;\n                            color: #333;\n                        }\n                        header {\n                            background-color: #0078d4;\n                            color: white;\n                            padding: 1rem;\n                            text-align: center;\n                        }\n                        nav {\n                            display: flex;\n                            justify-content: center;\n                            background-color: #005bb5;\n                            padding: 0.5rem;\n                        }\n                        nav a {\n                            color: white;\n                            text-decoration: none;\n                            margin: 0 1rem;\n                            font-weight: bold;\n                        }\n                        nav a:hover {\n                            text-decoration: underline;\n                        }\n                        main {\n                            padding: 2rem;\n                            max-width: 800px;\n                            margin: auto;\n                            background-color: white;\n                            border-radius: 8px;\n                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n                        }\n                        form {\n                            display: flex;\n                            flex-direction: column;\n                        }\n                        form label {\n                            margin: 0.5rem 0 0.2rem;\n                        }\n                        form input, form select, form textarea, form button {\n                            padding: 0.8rem;\n                            margin-bottom: 1rem;\n                            border: 1px solid #ccc;\n                            border-radius: 4px;\n                        }\n                        form button {\n                            background-color: #0078d4;\n                            color: white;\n                            border: none;\n                            cursor: pointer;\n                        }\n                        form button:hover {\n                            background-color: #005bb5;\n                        }\n                        footer {\n                            text-align: center;\n                            padding: 1rem;\n                            background-color: #0078d4;\n                            color: white;\n                            margin-top: 2rem;\n                        }\n                    </style>\n                </head>\n                <body>\n                    <header>\n                        <h1>Secret\u00E1ria Virtual</h1>\n                        <p>Gerencie seus pacientes de forma simples e eficiente</p>\n                    </header>\n                    <nav>\n                        <a href=\"/\">Home</a>\n                        <a href=\"/consulta_medica\">Consultas M\u00E9dicas</a>\n                        <a href=\"/paciente\">Lista de Pacientes</a>\n                        <a href=\"/receita_medica\">Visualizar Receita M\u00E9dica</a>\n                    </nav>\n                    <h1>Receitas M\u00E9dicas</h1>\n                    <table>\n                        <tr>\n                            <th>ID da Receita M\u00E9dica</th>\n                            <th>Nome do Paciente</th>\n                            <th>Data da Prescri\u00E7\u00E3o</th>\n                            <th>Nome do Medicamento</th>\n                            <th>Dosagem</th>\n                            <th>Frequ\u00EAncia</th>\n                            <th>Dura\u00E7\u00E3o</th>\n                            <th>Observa\u00E7\u00F5es</th>\n                            <th>Nome do M\u00E9dico</th>\n                        </tr>";
                    html += "</table>\n                        </body>\n            </html>";
                    res.send(html);
                }
                catch (error) {
                    console.error('Erro ao buscar dados:', error);
                    res.status(StatusCode.DatabaseError).send('Erro ao buscar pacientes.');
                }
                return [2 /*return*/];
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
            var startServer_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    startServer_1 = function (port) {
                        _this.app.listen(port, function () {
                            console.log("Servidor rodando na porta ".concat(port));
                            var params = {
                                function: "initialize()",
                                mensagem: "Servidor rodando na porta ${port}",
                                return_code: 0,
                                type_server: "typescript"
                            };
                            runPowerShellScriptInThread(scriptPath, params);
                        }).on('error', function (err) {
                            if (err.code === 'EADDRINUSE') {
                                console.error("Porta ".concat(port, " j\u00E1 est\u00E1 em uso."));
                                var alternativePort = port + 1;
                                console.log("Tentando porta alternativa ".concat(alternativePort, "..."));
                                startServer_1(alternativePort);
                            }
                            else {
                                throw err;
                            }
                        });
                    };
                    startServer_1(this.port);
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
                                    process.exit(StatusCode.ExitSuccess);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (error) {
                    console.error('Erro ao conectar ao banco de dados:', error);
                    process.exit(StatusCode.ExitFail);
                }
                return [2 /*return*/];
            });
        });
    };
    Server.prototype.checkPortAvailability = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var server = net_1.default.createServer(function (socket) {
                            console.log('Cliente conectado');
                            // Escutar dados recebidos
                            socket.on('data', function (data) {
                                console.log('Recebido:', data.toString());
                                socket.write('Mensagem recebida com sucesso!');
                            });
                            // Quando o cliente se desconectar
                            socket.on('end', function () {
                                console.log('Cliente desconectado');
                            });
                            // Tratamento de erros
                            socket.on('error', function (err) {
                                console.error('Erro:', err);
                            });
                        });
                    })];
            });
        });
    };
    Server.prototype.getKey = function () {
        return this.key;
    };
    Server.prototype.getValue = function () {
        return this.value;
    };
    Server.prototype.setKey = function (key) {
        this.key = key;
    };
    Server.prototype.setValue = function (value) {
        this.value = value;
    };
    return Server;
}());
exports.Server = Server;
function runPowerShellScriptInThread(scriptPath, params) {
    if (worker_threads_1.isMainThread) {
        // Cria uma nova thread para executar o script PowerShell
        var worker_1 = new worker_threads_1.Worker(__filename, {
            workerData: { scriptPath: scriptPath, params: params }
        });
        worker_1.on('message', function (message) {
            console.log('Saída do PowerShell:\n', message);
        });
        worker_1.on('error', function (error) {
            console.error("Erro na execu\u00E7\u00E3o da thread: ".concat(error.message));
        });
        worker_1.on('exit', function (code) {
            if (code !== 0) {
                console.error("A thread terminou com erro (c\u00F3digo: ".concat(code, ")"));
            }
        });
    }
    else {
        // Código que será executado na thread
        var scriptPath_1 = worker_threads_1.workerData.scriptPath, params_1 = worker_threads_1.workerData.params;
        // Aqui, fazemos uma simulação de execução do PowerShell.
        // Substitua esse código por sua lógica interna para rodar PowerShell sem `child_process`.
        var args = Object.entries(params_1).map(function (_a) {
            var key = _a[0], value = _a[1];
            return "-".concat(key, " \"").concat(value, "\"");
        }).join(" ");
        var simulatedOutput = "Simulando execu\u00E7\u00E3o de PowerShell com o script: ".concat(scriptPath_1, " e par\u00E2metros: ").concat(args);
        // Passa a saída para o thread principal
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(simulatedOutput);
    }
}
new Server(3000);
