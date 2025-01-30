var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as readlineSync from 'readline-sync';
import { MenuPacient } from './menu-paciente';
import { MenuSchedule } from './consulta-medica';
import { DoctorService } from '../Back-end/doctor.service';
class MenuStarter {
    // Método principal do menu
    menuPrincipal() {
        return __awaiter(this, void 0, void 0, function* () {
            let option;
            do {
                console.log('\n--- Sistema de Secretaria Virtual ---');
                console.log('1. Menu Paciente');
                console.log('2. Menu Consulta Médica');
                console.log('3. Receita Médica');
                console.log('4. Imprimir Receita Médica');
                console.log('5. Sair');
                // Captura a escolha do usuário
                option = readlineSync.question('Escolha uma opcao: ');
                // Executa a funcionalidade correspondente
                switch (option) {
                    case '1':
                        yield this.menuPaciente();
                        break;
                    case '2':
                        yield this.menuConsultaMedica();
                        break;
                    case '3':
                        yield this.receitaMedica();
                        break;
                    case '4':
                        yield this.imprimirReceitaMedica();
                        break;
                    case '5':
                        console.log('Saindo do sistema...');
                        break;
                    default:
                        console.log('Opcao invalida. Escolha entre 1, 2 ou 5.');
                }
            } while (option !== '5');
            console.log('Obrigado por usar o sistema. Até a próxima!');
        });
    }
    // Método para acessar o menu do paciente
    menuPaciente() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paciente = new MenuPacient();
                yield paciente.menuPaciente();
            }
            catch (err) {
                console.error('Erro ao executar o menu paciente:', err);
            }
        });
    }
    // Método para acessar o menu de consulta médica
    menuConsultaMedica() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const medico = new MenuSchedule();
                yield medico.consultaMedica();
            }
            catch (err) {
                console.error('Erro ao executar o menu consulta médica:', err);
            }
        });
    }
    // Registrar visita
    receitaMedica() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = parseInt(readlineSync.question('ID do paciente: '), 10);
                const doctorId = parseInt(readlineSync.question('ID do doutor: '), 10);
                const codeMed = readlineSync.question('Código do medicamento: ');
                const receitaId = parseInt(readlineSync.question('ID da receita medica: '), 10);
                const medicamentoId = parseInt(readlineSync.question('ID do medicamento: '), 10);
                const nomeMedicamento = readlineSync.question('Nome do medicamento: ');
                const tipoMedicamento = readlineSync.question('Tipo do medicamento: ');
                const dataMed = readlineSync.question('Data da medicacao (aaaa/mm/dd): ');
                const dosage = readlineSync.question('Dosagem da medicacao: ');
                const frequency = readlineSync.question('Frequência de medicacao: ');
                const consume = readlineSync.question('Duracao da dose: ');
                const observation = readlineSync.question('Observacoes: ');
                yield DoctorService.medicRecip({ patientId,
                    doctorId,
                    codeMed,
                    receitaId,
                    medicamentoId,
                    dataMed,
                    observation,
                    nomeMedicamento,
                    tipoMedicamento,
                    frequency,
                    dosage,
                    consume });
                console.log('Medicamento registrado com sucesso!');
            }
            catch (err) {
                console.error('Erro ao registrar visita:', err);
            }
        });
    }
    imprimirReceitaMedica() {
        return __awaiter(this, void 0, void 0, function* () {
            const recipId = parseInt(readlineSync.question('ID do medicamento: '), 10);
            const receitas = yield DoctorService.printMedicRecip(recipId);
            console.log('\n--- Lista de Receitas Médicas ---');
            receitas.forEach((receitas) => {
                const date = new Date(receitas.data_prescricao).toDateString();
                const dosagem = receitas.dosagem;
                const frequencia = receitas.frequencia;
                const duracao = receitas.duracao;
                const observacao = receitas.observacoes;
                console.table([
                    {
                        Medicamento: receitas.nome_medicamento,
                        Dosagem: dosagem,
                        Frequencia: frequencia,
                        Duracao: duracao,
                        Observacao: observacao,
                        Data: date
                    }
                ]);
            });
        });
    }
}
// Ponto de entrada da aplicação
(() => __awaiter(void 0, void 0, void 0, function* () {
    const menu = new MenuStarter();
    try {
        console.log('Iniciando sistema de secretaria virtual...');
        yield menu.menuPrincipal();
        console.log('Sistema encerrado com sucesso.');
    }
    catch (err) {
        console.error('Erro fatal na aplicação:', err);
    }
}))();
