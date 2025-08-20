// entity
import crypto from "crypto";
import { CarPlate } from "../vo/CarPlate";
import { Cpf } from "../vo/Cpf";
import { Email } from "../vo/Email";
import { Name } from "../vo/Name";

export class Account {
  private constructor(
    readonly accountId: string,
    private _name: Name,
    private _email: Email,
    private _cpf: Cpf,
    private _carPlate: CarPlate,
    readonly isPassenger: boolean,
    readonly isDriver: boolean
  ) {}

  set name(value: string) {
    this._name = new Name(value);
  }

  get name() {
    return this._name.value;
  }

  get email() {
    return this._email.value;
  }

  get cpf() {
    return this._cpf.value;
  }

  get carPlate() {
    return this._carPlate.value;
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean
  ) {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      new CarPlate(carPlate),
      isPassenger,
      isDriver
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      new CarPlate(carPlate),
      isPassenger,
      isDriver
    );
  }
}
