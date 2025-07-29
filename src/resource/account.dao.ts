import pgp from "pg-promise";

// Drive/Resource Port
export interface AccountDAO {
  getByEmail(email: string): Promise<any>;
  getById(accountId: string): Promise<any>;
  save(account: any): Promise<void>;
}

// Drive/Resource Adapter
export class AccountDAODatabase implements AccountDAO {
  async getByEmail(email: string) {
    const connection = pgp()("postgres://postgres:12345@localhost:5555/app");
    const [acc] = await connection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    return acc;
  }

  async getById(accountId: string) {
    const connection = pgp()("postgres://postgres:12345@localhost:5555/app");
    const [acc] = await connection.query(
      "select * from cccat16.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    return acc;
  }

  async save(input: Record<string, any>) {
    const connection = pgp()("postgres://postgres:12345@localhost:5555/app");
    await connection.query(
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
    await connection.$pool.end();
  }
}

// Drive/Resource Adapter
export class AccountDAOMemory implements AccountDAO {
  private readonly accounts: any[];

  constructor() {
    this.accounts = [];
  }

  async getByEmail(email: string): Promise<any> {
    const account = this.accounts.find((account) => account.email === email);
    return account;
  }

  async getById(accountId: string): Promise<any> {
    const account = this.accounts.find(
      (account) => account.accountId === accountId
    );
    return account;
  }

  async save(account: any): Promise<void> {
    this.accounts.push(account);
  }
}
