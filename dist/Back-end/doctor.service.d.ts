import { Database } from './database.ts';
declare class RecipDetails {
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
    constructor(patientId: number, doctorId: number, codeMed: string, recipId: number, medicamentoId: number, dataMed: string, observacao: string, medicationName: string, medicationType: string, frequencia: string, dosagem: string, consumo: string);
}
export declare class DoctorService {
    private static _databaseInstance;
    static get databaseInstance(): Database;
    static set databaseInstance(database: Database);
    static appoitmentView(): Promise<any[]>;
    static addDoctor(name: string, phone: string, email: string, speciality: string): Promise<void>;
    static visitDoctor(patientId: number, doctorId: number): Promise<void>;
    static recordSchedule(patient_id: number, doctor_id: number, date: string, time: string, reason: string, status: string, nome_consulta_medica: string): Promise<void>;
    static medicRecip(recipDetails: RecipDetails): Promise<void>;
    static printMedicRecip(id_medicamento: number): Promise<any[]>;
}
export {};
