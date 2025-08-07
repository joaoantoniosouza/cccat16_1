import { GetAccount } from "../../application/usecase/get-account";
import { Signup } from "../../application/usecase/signup";
import { HttpServer } from "./http-server";

export class AccountController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly signup: Signup,
    private readonly getAccount: GetAccount
  ) {
    this.httpServer.register(
      "post",
      "/signup",
      async (params: any, body: any) => {
        const output = await this.signup.execute(body);
        return output;
      }
    );
    this.httpServer.register(
      "get",
      "/accounts/:accountId",
      async (params: any, body: any) => {
        const account = await this.getAccount.execute(params.accountId);
        return account;
      }
    );
  }
}
