// use case
import { AccountRepository } from "../../infra/repository/account.repository";
import { MailerGateway } from "../../infra/gateway/mailer.gateway";
import { Account } from "../../domain/entity/account";

export class Signup {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly mailerGateway: MailerGateway
  ) {}

  async execute(input: any): Promise<any> {
    const existingAccount = await this.accountRepository.getByEmail(
      input.email
    );
    if (existingAccount) throw new Error("Account already exists");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver
    );
    await this.accountRepository.save(account);
    await this.mailerGateway.send(account.email, "Welcome!", "");
    return {
      accountId: account.accountId,
    };
  }
}
