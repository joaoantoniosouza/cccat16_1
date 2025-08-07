// use case
import { AccountRepository } from "../../infra/repository/account.repository";

export class GetAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<any> {
    const account = await this.accountRepository.getById(accountId);
    return account;
  }
}
