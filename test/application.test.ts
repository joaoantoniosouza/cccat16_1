import { GetAccount } from "../src/application/get-account";
import { Signup } from "../src/application/signup";
import { AccountDAOMemory } from "../src/resource/account.dao";
import { MailerGatewayMemory } from "../src/resource/mailer.gateway";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(async function () {
  const accountDAO = new AccountDAOMemory();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO);
});

test("Deve criar uma conta para o passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
    isDriver: false,
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Deve criar uma conta para o motorista", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.carPlate).toBe(input.carPlate);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Não deve criar uma conta para o passageiro se o nome for inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar uma conta para o passageiro se o email for inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Não deve criar uma conta para o passageiro se o cpf for inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "8774824",
    carPlate: "AAA9999",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid CPF")
  );
});

test("Não deve criar uma conta para o motorista se a placa for inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "AAA",
    isDriver: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

test("Não deve criar uma conta para o passageiro se o email já existe", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});
