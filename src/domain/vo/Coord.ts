export class Coord {
  private readonly _lat: number;
  private readonly _long: number;

  constructor(lat: number, long: number) {
    if (lat < -90 || lat > 90) throw new Error("Invalid latitude");
    if (long < -90 || long > 90) throw new Error("Invalid longitude");
    this._lat = lat;
    this._long = long;
  }

  get lat() {
    return this._lat;
  }

  get long() {
    return this._long;
  }
}
