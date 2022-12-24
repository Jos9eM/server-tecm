import express from "express";
import morgan from "morgan";
import IndexRouter from "./routes/index.routes";
import UserRouter from "./routes/usuarios";

export default class Server {
  public app: express.Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set("port", this.port || process.env.port || 3000);
  }

  // ----------------------------------------------------------------
  // Middleware procesa los metodos del servicio
  // ----------------------------------------------------------------
  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  }

  routes() {
    this.app.use(IndexRouter);
    this.app.use("/user", UserRouter);
  }

  async start() {
    await this.app.listen(this.app.get("port"));
    console.log(`Server started on port`, this.app.get("port"));
  }
}
