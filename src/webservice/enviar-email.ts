import EmailService from "./email-servico";

const emailService = new EmailService();

async function main() {
  try {
    await emailService.sendEmail(
      "destinatario@example.com",
      "Assunto do E-mail",
      "Texto do e-mail",
      "<p>Texto do e-mail em <strong>HTML</strong></p>"
    );
    console.log("E-mail enviado com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
  }
}

main();