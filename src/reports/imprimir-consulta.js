"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reportGenerator_1 = require("./reportGenerator");
const patients = [
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
    const fileName = (0, reportGenerator_1.generateReport)(patients, 'pdf'); // Escolha: 'json', 'html', ou 'pdf'
    console.log(`Report generated: ${fileName}`);
}
catch (error) {
    console.error(error);
}
