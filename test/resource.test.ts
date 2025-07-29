import { AccountDAODatabase } from "../src/resource/account.dao";
import crypto from "crypto";

test("Deve salvar um resgistro na tabela account e consultar por id", async function () {
  const accountDAO = new AccountDAODatabase();
  const account = {
    accountId: crypto.randomUUID(),
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
    isDriver: false,
  };
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getById(account.accountId);
  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.cpf).toBe(account.cpf);
  expect(savedAccount.is_passenger).toBe(account.isPassenger);
  expect(savedAccount.is_driver).toBe(account.isDriver);
});

test("Deve salvar um resgistro na tabela account e consultar por email", async function () {
  const accountDAO = new AccountDAODatabase();
  const account = {
    accountId: crypto.randomUUID(),
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
    isDriver: false,
  };
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getByEmail(account.email);
  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.cpf).toBe(account.cpf);
  expect(savedAccount.is_passenger).toBe(account.isPassenger);
  expect(savedAccount.is_driver).toBe(account.isDriver);
});
