// use case
import { AccountDAO } from "../resource/account.dao";

export class GetAccount {
  constructor(private readonly accountDAO: AccountDAO) {}

  async execute(accountId: string): Promise<any> {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
