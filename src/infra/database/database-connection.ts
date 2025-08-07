// framework and driver
import pgp from "pg-promise";

export interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  private readonly connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:12345@localhost:5555/app");
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
