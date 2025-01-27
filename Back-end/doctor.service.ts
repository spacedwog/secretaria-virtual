import { Database } from './database';

class RecipDetails {
  patientId: number;
  doctorId: number;
  codeMed: string;
  receitaId: number;
  medicamentoId: number;
  dataMed: string;
  observation?: string;
  nomeMedicamento: string;
  tipoMedicamento: string;
  frequency: string;
  dosage: string;
  consume: string;

  constructor(patientId: number, doctorId: number, codeMed: string, recipId: number, medicamentoId: number, dataMed: string, observacao: string, medicationName: string, medicationType: string, frequencia: string, dosagem: string, consumo: string) {
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
}
export class DoctorService {
  private static _databaseInstance: Database;

  // Getter para inicializar e acessar a instância do Database
  static get databaseInstance(): Database {
    if (!this._databaseInstance) {
      this._databaseInstance = new Database();
    }
    return this._databaseInstance;
  }

  // Setter caso precise atualizar a instância do Database (se necessário)
  static set databaseInstance(database: Database) {
    this._databaseInstance = database;
  }

  static async appoitmentView(): Promise<any[]> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      const result = await Database.query("SELECT * FROM patient_appointments_view");
      return result;
    } catch (error) {
      console.error('Error listing appointments:', error);
      throw new Error('Failed to list appointments. Please try again later.');
    }
  }

  static async addDoctor(
    name: string,
    phone: string,
    email: string,
    speciality: string
  ): Promise<void> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      await Database.query(
        'CALL add_doctor(?, ?, ?, ?)',
        [name, speciality, phone, email]
      );
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw new Error('Failed to add doctor. Please check the input data and try again.');
    }
  }

  static async visitDoctor(
    patientId: number,
    doctorId: number
  ): Promise<void> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      const currentDate = new Date();
      const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
      const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
      await Database.query(
        'CALL visit_doctor(?, ?, ?, ?)',
        [date, time, patientId, doctorId]
      );
    } catch (error) {
      console.error('Error visiting doctor:', error);
      throw new Error('Failed to visit doctor. Please check the input data and try again.');
    }
  }

  static async recordSchedule(
    patient_id: number,
    doctor_id: number,
    date: string,
    time: string,
    reason: string,
    status: string
  ): Promise<void> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      await Database.query(
        'CALL make_appointment(?, ?, ?, ?, ?, ?)',
        [date, time, reason, status, patient_id, doctor_id]
      );
    } catch (error) {
      console.error('Error recording schedule:', error);
      throw new Error('Failed to record schedule. Please check the input data and try again.');
    }
  }

  public static async medicRecip(recipDetails: RecipDetails): Promise<void> {
    const { patientId, doctorId, codeMed, receitaId, medicamentoId, dataMed, observation, nomeMedicamento, tipoMedicamento, frequency, dosage, consume } = recipDetails;

    const code_medicamento = codeMed;
    const id_paciente = patientId;
    const id_medico = doctorId;
    const data_prescricao = dataMed.toString().split('T')[0];
    const observacao = observation;
    const id_receita = receitaId;
    const id_medicamento = medicamentoId;
    const nome_medicamento = nomeMedicamento;
    const tipo_medicamento = tipoMedicamento;
    const frequencia = frequency;
    const dosagem = dosage;
    const duracao = consume;
  
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      await Database.query(
        'CALL create_medic_recip(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [code_medicamento, id_paciente, id_medico, data_prescricao, observacao, id_receita, id_medicamento, nome_medicamento, tipo_medicamento, dosagem, frequencia, duracao]
      );
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new Error('Failed to add medication. Please check the input data and try again.');
    }
  }

  static async printMedicRecip(id_medicamento: number): Promise<any[]> {
    try {
      await Database.init(); // Alterado para chamar o método estático diretamente
      const result = await Database.query('SELECT * FROM vw_receitas_detalhadas WHERE id_medicamento = ?',
        [id_medicamento]
      );
      return result;
    } catch (error) {
      console.error('Error printing medication:', error);
      throw new Error('Failed to print medication. Please check the input data and try again.');
    }
  }
}