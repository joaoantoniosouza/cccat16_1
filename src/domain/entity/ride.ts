import crypto from "crypto";
import { Coord } from "../vo/Coord";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import { Segment } from "../vo/Segment";

export class Ride {
  status: RideStatus;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private _driverId: string,
    private segment: Segment,
    status: string,
    readonly date: Date
  ) {
    this.status = RideStatusFactory.create(this, status);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ) {
    const rideId = crypto.randomUUID();
    const date = new Date();
    const status = "requested";
    return new Ride(
      rideId,
      passengerId,
      "",
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      status,
      date
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date
  ) {
    return new Ride(
      rideId,
      passengerId,
      driverId,
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      status,
      date
    );
  }

  get fromLat() {
    return this.segment.from.lat;
  }

  get fromLong() {
    return this.segment.from.long;
  }

  get toLat() {
    return this.segment.to.lat;
  }

  get toLong() {
    return this.segment.to.long;
  }

  get driverId() {
    return this._driverId;
  }

  getStatus() {
    return this.status.value;
  }

  accept(driverId: string) {
    this.status.accept();
    this._driverId = driverId;
  }

  start() {
    this.status.start();
  }
}
