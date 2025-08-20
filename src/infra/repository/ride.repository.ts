import { DatabaseConnection } from "../database/database-connection";
import { Ride } from "../../domain/entity/ride";

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  update(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  async save(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      "insert into cccat16.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.getStatus(),
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.date,
      ]
    );
  }

  async getById(rideId: string): Promise<Ride> {
    const [rideData] = await this.databaseConnection.query(
      "select * from cccat16.ride where ride_id = $1",
      [rideId]
    );
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.status,
      rideData.date
    );
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const [rideData] = await this.databaseConnection.query(
      "select * from cccat16.ride where passenger_id = $1 and status <> 'completed'",
      [passengerId]
    );
    return Boolean(rideData);
  }

  async update(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      "update cccat16.ride set status = $1, driver_id = $2 where ride_id = $3",
      [ride.getStatus(), ride.driverId, ride.rideId]
    );
  }
}
