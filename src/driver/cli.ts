//main, framework and driver, interface adapter
import { Signup } from "../application/signup";
import { AccountDAOMemory } from "../resource/account.dao";
import { MailerGatewayMemory } from "../resource/mailer.gateway";

let input: any = {};
process.stdin.on("data", async function (chunk) {
  const command = chunk.toString().replace(/\n/g, "");
  if (command.startsWith("name")) {
    input.name = command.replace("name", "");
  }
  if (command.startsWith("email")) {
    input.email = command.replace("email", "");
  }
  if (command.startsWith("cpf")) {
    input.cpf = command.replace("cpf", "");
  }
  if (command.startsWith("signup")) {
    const accountDAO = new AccountDAOMemory();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const output = await signup.execute(input);
    console.log(output);
  }
});
