export class CarPlate {
  private readonly _value;

  constructor(value: string) {
    if (value && !value.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid car plate");
    this._value = value;
  }

  get value() {
    return this._value;
  }
}
