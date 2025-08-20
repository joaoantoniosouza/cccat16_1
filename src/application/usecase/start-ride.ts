import { RideRepository } from "../../infra/repository/ride.repository";

export class StartRide {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    ride.start();
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
};
