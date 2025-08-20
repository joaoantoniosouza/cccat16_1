export class Name {
  private _value: string;

  constructor(value: string) {
    if (!value.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    this._value = value;
  }

  get value() {
    return this._value;
  }
}
