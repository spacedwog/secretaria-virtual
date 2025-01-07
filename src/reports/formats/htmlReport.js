"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHTMLReport = generateHTMLReport;
const fs = __importStar(require("fs"));
function generateHTMLReport(patients) {
    const fileName = 'report.html';
    const html = `
    <html>
    <head>
      <title>Patient Report</title>
    </head>
    <body>
      <h1>Patient Report</h1>
      <table border="1">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Date of Consultation</th>
          <th>Reason for Consultation</th>
        </tr>
        ${patients
        .map(patient => `
            <tr>
              <td>${patient.id}</td>
              <td>${patient.name}</td>
              <td>${patient.age}</td>
              <td>${patient.appointmentDate}</td>
              <td>${patient.reason}</td>
            </tr>
          `)
        .join('')}
      </table>
    </body>
    </html>
  `;
    fs.writeFileSync(fileName, html, 'utf-8');
    console.log(`HTML report saved as ${fileName}`);
    return fileName;
}
