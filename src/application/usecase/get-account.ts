// use case
import { AccountRepository } from "../../infra/repository/account.repository";

export class GetAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getById(accountId);
    return {
      accountId: account.accountId,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      carPlate: account.carPlate,
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
    };
  }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};
