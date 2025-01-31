export declare class ETLProcess {
    private patientId;
    private patientAge;
    private patientName;
    private patientPhone;
    private patientEmail;
    private patientAddress;
    private cartaoCadastro;
    gerarCartaoPaciente(): Promise<void>;
    private extractDataPacient;
    private transformDataPacient;
    private loadDataPacient;
    getPatientId(): number;
    getPatientName(): string;
    getPatientAge(): number;
    getPatientPhone(): string;
    getPatientEmail(): string;
    getPatientAddress(): string;
    getCartaoCadastro(): string;
    setPatientId(patient_id: number): void;
    setPatientName(name: string): void;
    setPatientAge(age: number): void;
    setPatientPhone(phone: string): void;
    setPatientEmail(email: string): void;
    setPatientAddress(address: string): void;
    setCartaoCadastro(cartao_cadastro: string): void;
}
