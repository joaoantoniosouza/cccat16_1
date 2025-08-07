import { Account } from "../src/domain/account";
import { PgPromiseAdapter } from "../src/infra/database/database-connection";
import { AccountRepositoryDatabase } from "../src/infra/repository/account.repository";
import crypto from "crypto";

test("Deve salvar um resgistro na tabela account e consultar por id", async function () {
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const account = Account.create(
    "John Doe",
    `john.doe${Math.random()}@gmail.com`,
    "87748248800",
    "",
    true,
    false
  );
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getById(account.accountId);
  expect(savedAccount?.accountId).toBe(account.accountId);
  expect(savedAccount?.name).toBe(account.name);
  expect(savedAccount?.email).toBe(account.email);
  expect(savedAccount?.cpf).toBe(account.cpf);
  expect(savedAccount?.isPassenger).toBe(account.isPassenger);
  expect(savedAccount?.isDriver).toBe(account.isDriver);
  await databaseConnection.close();
});

test("Deve salvar um resgistro na tabela account e consultar por email", async function () {
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const account = Account.create(
    "John Doe",
    `john.doe${Math.random()}@gmail.com`,
    "87748248800",
    "",
    true,
    false
  );
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getByEmail(account.email);
  expect(savedAccount?.accountId).toBe(account.accountId);
  expect(savedAccount?.name).toBe(account.name);
  expect(savedAccount?.email).toBe(account.email);
  expect(savedAccount?.cpf).toBe(account.cpf);
  expect(savedAccount?.isPassenger).toBe(account.isPassenger);
  expect(savedAccount?.isDriver).toBe(account.isDriver);
  await databaseConnection.close();
});
