"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayMenu = displayMenu;
function displayMenu(options) {
    console.log('1. ' + options.viewPatients);
    console.log('2. ' + options.addPatient);
    console.log('3. ' + options.generateReport);
    console.log('4. ' + options.exit);
}
