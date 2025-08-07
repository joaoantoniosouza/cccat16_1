import { AccountRepository } from "../../infra/repository/account.repository";
import { RideRepository } from "../../infra/repository/ride.repository";
import { Ride } from "../../domain/ride";

export class RequestRide {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getById(input.passengerId);
    if (!account?.isPassenger)
      throw new Error("Account is not from a passenger ");
    const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(
      input.passengerId
    );
    if (hasActiveRide) throw new Error("Passenger has an active ride");
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );
    await this.rideRepository.save(ride);
    return { rideId: ride.rideId };
  }
}

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};
