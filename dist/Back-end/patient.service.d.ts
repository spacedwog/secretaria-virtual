export declare class PatientService {
    static listPatients(): Promise<any[]>;
    static addPatient(name: string, age: number, phone: string, email: string, address: string): Promise<void>;
    static editPatient(patientId: number, fieldsToUpdate: Record<string, any>): Promise<void>;
    static deletePatient(patientId: number): Promise<void>;
}
