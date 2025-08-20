import { AccountRepository } from "../../infra/repository/account.repository";
import { RideRepository } from "../../infra/repository/ride.repository";

export class GetRide {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getById(input.rideId);
    const passenger = await this.accountRepository.getById(ride.passengerId);
    let driver;
    if (ride.driverId) {
      driver = await this.accountRepository.getById(ride.driverId);
    }
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      status: ride.getStatus(),
      passengerName: passenger.name,
      passengerEmail: passenger.email,
      driverName: driver?.name,
      driverEmail: driver?.email,
    };
  }
}

type Input = {
  rideId: string;
};

type Output = {
  rideId: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  passengerName: string;
  passengerEmail: string;
  driverName?: string;
  driverEmail?: string;
};
