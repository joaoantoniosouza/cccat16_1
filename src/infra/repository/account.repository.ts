// interface adapter

import { Account } from "../../domain/account";
import { DatabaseConnection } from "../database/database-connection";

// Drive/Resource Port
export interface AccountRepository {
  getByEmail(email: string): Promise<Account | undefined>;
  getById(accountId: string): Promise<Account>;
  save(account: Account): Promise<void>;
}

// Drive/Resource Adapter
export class AccountRepositoryDatabase implements AccountRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  async getByEmail(email: string): Promise<Account | undefined> {
    const [accountData] = await this.databaseConnection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );
    if (!accountData) return;
    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async getById(accountId: string): Promise<Account> {
    const [accountData] = await this.databaseConnection.query(
      "select * from cccat16.account where account_id = $1",
      [accountId]
    );
    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async save(input: Account) {
    await this.databaseConnection.query(
      "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        input.accountId,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
      ]
    );
  }
}

// Drive/Resource Adapter
export class AccountRepositoryMemory implements AccountRepository {
  private readonly accounts: Account[];

  constructor() {
    this.accounts = [];
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const account = this.accounts.find((account) => account.email === email);
    return account;
  }

  async getById(accountId: string): Promise<Account> {
    const account = this.accounts.find(
      (account) => account.accountId === accountId
    );
    return account as Account;
  }

  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
