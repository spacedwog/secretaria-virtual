import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Exemplo com o Gmail, ajuste conforme necessário
      port: 587,
      secure: false, // true para 465, false para outros
      auth: {
        user: 'seu_email@gmail.com', // Insira o e-mail do remetente
        pass: 'sua_senha'           // Insira a senha ou o app password
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
      const mailOptions = {
        from: '"Sua Secretária Virtual" <seu_email@gmail.com>', // Nome do remetente
        to, // Destinatário
        subject, // Assunto
        text, // Corpo do e-mail em texto
        html, // Corpo do e-mail em HTML (opcional)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`E-mail enviado: ${info.messageId}`);
    } catch (error) {
      console.error(`Erro ao enviar o e-mail: ${error}`);
    }
  }
}

// Exemplo de uso
(async () => {
  const emailService = new EmailService();
  await emailService.sendEmail(
    'destinatario@gmail.com',
    'Assunto do E-mail',
    'Este é o corpo do e-mail em texto.',
    '<p>Este é o corpo do e-mail em <b>HTML</b>.</p>'
  );
})();