import { GetRide } from "../src/application/usecase/get-ride";
import { RequestRide } from "../src/application/usecase/request-ride";
import { Signup } from "../src/application/usecase/signup";
import { AccountRepositoryDatabase } from "../src/infra/repository/account.repository";
import { MailerGatewayMemory } from "../src/infra/gateway/mailer.gateway";
import { RideRepositoryDatabase } from "../src/infra/repository/ride.repository";
import { PgPromiseAdapter } from "../src/infra/database/database-connection";
import { AcceptRide } from "../src/application/usecase/accept-ride";
import { StartRide } from "../src/application/usecase/start-ride";

test("Deve aceitar uma corrida", async function () {
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isDriver: true,
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const acceptRide = new AcceptRide(accountRepository, rideRepository);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const startRide = new StartRide(rideRepository);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const getRide = new GetRide(accountRepository, rideRepository);
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const outputGetRide = await getRide.execute(inputGetRide);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("in_progress");
  await databaseConnection.close();
});
