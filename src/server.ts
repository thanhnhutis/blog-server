import "express-async-errors";
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { NotFoundError } from "./errors/not-found-error";
import { CustomError } from "./errors/custom-error";
import routes from "./router";
import cookieParser from "cookie-parser";
import deserializeUser from "./middleware/deserializeUser";

export default class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config() {
    const baseURL = process.env.SERVER_PUBLIC_URL ?? "http://localhost:4000";

    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      cors({
        origin: baseURL,
        credentials: true,
      })
    );
    this.app.use(cookieParser());

    // middleware
    this.app.use(deserializeUser);
    // routes
    this.app.use("/api", routes);
    // handle 404
    this.app.use((req, res, next) => {
      throw new NotFoundError();
    });
    // handle error
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof CustomError) {
          return res
            .status(error.statusCode)
            .send({ errors: error.serializeErrors() });
        }
        console.log(error);
        return res.status(400).send({
          errors: [{ message: "Something went wrong" }],
        });
      }
    );
  }

  start() {
    if (!process.env.DATABASE_URL)
      throw new Error("DATABASE_URL must be defined");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be defined");
    if (!process.env.CSRF_SECRET)
      throw new Error("CSRF_SECRET must be defined");
    if (!process.env.GOOGLE_CLIENT_ID)
      throw new Error("GOOGLE_CLIENT_ID must be defined");
    if (!process.env.GOOGLE_CLIENT_SECRET)
      throw new Error("GOOGLE_CLIENT_SECRET must be defined");
    if (!process.env.GOOGLE_REDIRECT_URI)
      throw new Error("GOOGLE_REDIRECT_URI must be defined");
    if (!process.env.GOOGLE_REFRESH_TOKEN)
      throw new Error("GOOGLE_REFRESH_TOKEN must be defined");

    this.app.listen(4000, () => {
      console.log(`Listening on 4000`);
    });
  }
}
