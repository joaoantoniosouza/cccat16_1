import { AccountRepository } from "../../infra/repository/account.repository";
import { RideRepository } from "../../infra/repository/ride.repository";
import { Ride } from "../../domain/ride";

export class AcceptRide {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly rideRepository: RideRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const account = await this.accountRepository.getById(input.driverId);
    if (!account?.isDriver) throw new Error("Account is not from a driver ");
    const ride = await this.rideRepository.getById(input.rideId);
    ride.accept(input.driverId);
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
  driverId: string;
};
