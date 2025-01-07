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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com', // Exemplo com o Gmail, ajuste conforme necessário
            port: 587,
            secure: false, // true para 465, false para outros
            auth: {
                user: 'seu_email@gmail.com', // Insira o e-mail do remetente
                pass: 'sua_senha' // Insira a senha ou o app password
            },
        });
    }
    sendEmail(to, subject, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: '"Sua Secretária Virtual" <seu_email@gmail.com>', // Nome do remetente
                    to, // Destinatário
                    subject, // Assunto
                    text, // Corpo do e-mail em texto
                    html, // Corpo do e-mail em HTML (opcional)
                };
                const info = yield this.transporter.sendMail(mailOptions);
                console.log(`E-mail enviado: ${info.messageId}`);
            }
            catch (error) {
                console.error(`Erro ao enviar o e-mail: ${error}`);
            }
        });
    }
}
// Exemplo de uso
(() => __awaiter(void 0, void 0, void 0, function* () {
    const emailService = new EmailService();
    yield emailService.sendEmail('destinatario@gmail.com', 'Assunto do E-mail', 'Este é o corpo do e-mail em texto.', '<p>Este é o corpo do e-mail em <b>HTML</b>.</p>');
}))();
