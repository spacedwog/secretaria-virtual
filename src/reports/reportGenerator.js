"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
const jsonReport_1 = require("./formats/jsonReport");
const htmlReport_1 = require("./formats/htmlReport");
const pdfReport_1 = require("./formats/pdfReport");
function generateReport(patients, format) {
    switch (format) {
        case 'json':
            return (0, jsonReport_1.generateJSONReport)(patients);
        case 'html':
            return (0, htmlReport_1.generateHTMLReport)(patients);
        case 'pdf':
            return (0, pdfReport_1.generatePDFReport)(patients);
        default:
            throw new Error('Invalid report format');
    }
}
