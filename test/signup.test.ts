import { Account } from "../src/domain/account";
import { GetAccount } from "../src/application/usecase/get-account";
import { Signup } from "../src/application/usecase/signup";
import {
  AccountRepositoryDatabase,
  AccountRepositoryMemory,
} from "../src/infra/repository/account.repository";
import { MailerGatewayMemory } from "../src/infra/gateway/mailer.gateway";
import sinon from "sinon";
import { PgPromiseAdapter } from "../src/infra/database/database-connection";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(async function () {
  const accountRepository = new AccountRepositoryMemory();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountRepository, mailerGateway);
  getAccount = new GetAccount(accountRepository);
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

test("Deve criar uma conta para o passageiro com stub", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
    isDriver: false,
  };
  const saveAccountStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "save")
    .resolves();
  const getAccountByEmailStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "getByEmail")
    .resolves(undefined);
  const getAccountByIdStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "getById")
    .resolves(
      Account.restore(
        "",
        input.name,
        input.email,
        input.cpf,
        "",
        input.isPassenger,
        input.isDriver
      )
    );
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
  saveAccountStub.restore();
  getAccountByEmailStub.restore();
  getAccountByIdStub.restore();
  await databaseConnection.close();
});

test("Deve criar uma conta para o passageiro com spy", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
    isDriver: false,
  };
  const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
  const accountRepository = new AccountRepositoryMemory();
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
  expect(sendSpy.calledWith(input.email, "Welcome!", "")).toBe(true);
  sendSpy.restore();
});

test("Deve criar uma conta para o passageiro com spy", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
    isDriver: false,
  };
  const sendMock = sinon.mock(MailerGatewayMemory.prototype);
  sendMock.expects("send").withArgs(input.email, "Welcome!", "").once();
  const accountRepository = new AccountRepositoryMemory();
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
  sendMock.verify();
  sendMock.restore();
});
