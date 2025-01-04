export class Patient {
  private _id: number;
  private _name: string;
  private _age: number;
  private _phone: string;
  private _email: string;
  private _address: string;

  constructor(id: number, name: string, age: number, phone: string, email: string, address: string) {
    this._id = id;
    this._name = name;
    this._age = age;
    this._phone = phone;
    this._email = email;
    this._address = address;
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get age(): number {
    return this._age;
  }

  get phone(): string {
    return this._phone;
  }

  get email(): string {
    return this._email;
  }

  get address(): string {
    return this._address;
  }

  // Setters
  set name(value: string) {
    if (value.trim().length === 0) {
      throw new Error("Name cannot be empty.");
    }
    this._name = value;
  }

  set age(value: number) {
    if (value < 0) {
      throw new Error("Age cannot be negative.");
    }
    this._age = value;
  }

  set phone(value: string) {
    if (!/^\d{10,15}$/.test(value)) {
      throw new Error("Invalid phone number format.");
    }
    this._phone = value;
  }

  set email(value: string) {
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      throw new Error("Invalid email address format.");
    }
    this._email = value;
  }

  set address(value: string) {
    this._address = value.trim();
  }
}

export class Doctor {
  private _id: number;
  private _name: string;
  private _specialty: string;
  private _phone: string;
  private _email: string;

  constructor(id: number, name: string, specialty: string, phone: string, email: string) {
    this._id = id;
    this._name = name;
    this._specialty = specialty;
    this._phone = phone;
    this._email = email;
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get specialty(): string {
    return this._specialty;
  }

  get phone(): string {
    return this._phone;
  }

  get email(): string {
    return this._email;
  }

  // Setters
  set name(value: string) {
    if (value.trim().length === 0) {
      throw new Error("Name cannot be empty.");
    }
    this._name = value;
  }

  set specialty(value: string) {
    if (value.trim().length === 0) {
      throw new Error("Specialty cannot be empty.");
    }
    this._specialty = value;
  }

  set phone(value: string) {
    if (!/^\d{10,15}$/.test(value)) {
      throw new Error("Invalid phone number format.");
    }
    this._phone = value;
  }

  set email(value: string) {
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      throw new Error("Invalid email address format.");
    }
    this._email = value;
  }
}