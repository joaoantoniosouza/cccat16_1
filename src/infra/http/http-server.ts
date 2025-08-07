// framework and driver
import express, { Request, Response } from "express";

export interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  private readonly app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const result = await callback(req.params, req.body);
        res.json(result);
      } catch (error: any) {
        res.status(422).json({ message: error.message });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
