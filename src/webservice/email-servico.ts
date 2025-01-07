import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Nome do Remetente" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });

      console.log("E-mail enviado com sucesso:", info.messageId);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Falha ao enviar e-mail.");
    }
  }
}

export default EmailService;