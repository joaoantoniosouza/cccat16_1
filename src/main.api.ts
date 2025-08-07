//main
import { GetAccount } from "./application/usecase/get-account";
import { AccountRepositoryDatabase } from "./infra/repository/account.repository";
import { MailerGatewayMemory } from "./infra/gateway/mailer.gateway";
import { Signup } from "./application/usecase/signup";
import { PgPromiseAdapter } from "./infra/database/database-connection";
import { AccountController } from "./infra/http/account.controller";
import { ExpressAdapter } from "./infra/http/http-server";

class MainAPI {
  private isShuttingDown = false;
  private exitCodes: any = {
    SIGINT: 0,
    SIGTERM: 0,
    unhandledRejection: 1,
    uncaughtException: 1,
  };

  private readonly httpServer = new ExpressAdapter();
  private readonly databaseConnection = new PgPromiseAdapter();

  constructor() {
    this.setupShutdownHooks();
  }

  private setupShutdownHooks() {
    process.on("SIGINT", async () => await this.shutdown("SIGINT"));
    process.on("SIGTERM", async () => await this.shutdown("SIGTERM"));
    process.on("uncaughtException", async (err) => {
      console.error("[uncaughtException]", err);
      await this.shutdown("uncaughtException");
    });
    process.on("unhandledRejection", async (reason) => {
      console.error("[unhandledRejection]", reason);
      await this.shutdown("unhandledRejection");
    });
  }

  private async shutdown(reason: string) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    console.log(`\n[shutdown] Encerrando aplicação. Motivo: ${reason}`);
    try {
      await this.databaseConnection.close();
      console.log("[shutdown] Conexão com o banco finalizada.");
    } catch (err) {
      console.error("[shutdown] Erro ao fechar conexão com o banco:", err);
    }
    const code = this.exitCodes[reason] ?? 1;
    console.log(`[shutdown] Saindo com código ${code}.`);
    process.exit(code);
  }

  private initControllers() {
    const accountRepository = new AccountRepositoryDatabase(
      this.databaseConnection
    );
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountRepository, mailerGateway);
    const getAccount = new GetAccount(accountRepository);
    new AccountController(this.httpServer, signup, getAccount);
  }

  initApplication() {
    const port = 3000;
    this.initControllers();
    this.httpServer.listen(port);
    console.log(`[main] Aplicação iniciada na porta ${port}`);
  }

  static start() {
    new MainAPI().initApplication();
  }
}

MainAPI.start();
