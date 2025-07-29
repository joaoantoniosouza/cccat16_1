import express from "express";
import { GetAccount } from "../application/get-account";
import { Signup } from "../application/signup";
import { AccountDAODatabase } from "../resource/account.dao";
import { MailerGatewayMemory } from "../resource/mailer.gateway";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  try {
    const accountDAO = new AccountDAODatabase();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const output = await signup.execute(req.body);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountDAO = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDAO);
  const account = await getAccount.execute(req.params.accountId);
  res.json(account);
});

app.listen(3000);
