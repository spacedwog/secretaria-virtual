"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = exports.Patient = void 0;
class Patient {
    constructor(id, name, age, phone, email, address) {
        this._id = id;
        this._name = name;
        this._age = age;
        this._phone = phone;
        this._email = email;
        this._address = address;
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get age() {
        return this._age;
    }
    get phone() {
        return this._phone;
    }
    get email() {
        return this._email;
    }
    get address() {
        return this._address;
    }
    // Setters
    set name(value) {
        if (value.trim().length === 0) {
            throw new Error("Name cannot be empty.");
        }
        this._name = value;
    }
    set age(value) {
        if (value < 0) {
            throw new Error("Age cannot be negative.");
        }
        this._age = value;
    }
    set phone(value) {
        if (!/^\d{10,15}$/.test(value)) {
            throw new Error("Invalid phone number format.");
        }
        this._phone = value;
    }
    set email(value) {
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            throw new Error("Invalid email address format.");
        }
        this._email = value;
    }
    set address(value) {
        this._address = value.trim();
    }
}
exports.Patient = Patient;
class Doctor {
    constructor(id, name, specialty, phone, email) {
        this._id = id;
        this._name = name;
        this._specialty = specialty;
        this._phone = phone;
        this._email = email;
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get specialty() {
        return this._specialty;
    }
    get phone() {
        return this._phone;
    }
    get email() {
        return this._email;
    }
    // Setters
    set name(value) {
        if (value.trim().length === 0) {
            throw new Error("Name cannot be empty.");
        }
        this._name = value;
    }
    set specialty(value) {
        if (value.trim().length === 0) {
            throw new Error("Specialty cannot be empty.");
        }
        this._specialty = value;
    }
    set phone(value) {
        if (!/^\d{10,15}$/.test(value)) {
            throw new Error("Invalid phone number format.");
        }
        this._phone = value;
    }
    set email(value) {
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            throw new Error("Invalid email address format.");
        }
        this._email = value;
    }
}
exports.Doctor = Doctor;
