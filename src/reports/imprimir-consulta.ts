import { Patient } from '../database/models/patient.models';
import { generateReport } from './reportGenerator';

const patients: Patient[] = [
    {
        id: 1, name: 'John Doe', age: 35, appointmentDate: '2025-01-07', reason: 'Headache',
        phone: '',
        email: ''
    },
    {
        id: 2, name: 'Jane Smith', age: 28, appointmentDate: '2025-01-08', reason: 'Check-up',
        phone: '',
        email: ''
    },
];

try {
    const fileName = generateReport(patients, 'html'); // Escolha: 'json', 'html', ou 'pdf'
    console.log(`Report generated: ${fileName}`);
}
catch (error) {
    console.error(error);
}