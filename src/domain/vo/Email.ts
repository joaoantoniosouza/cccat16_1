export class Email {
  private readonly _value;

  constructor(value: string) {
    if (!value.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    this._value = value;
  }

  get value() {
    return this._value;
  }
}
