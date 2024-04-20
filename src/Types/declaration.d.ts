import { HydratedDocument } from "mongoose";
import { IUser } from "./Types";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_URL: string;
      SECRET_KEY: string;
    }
  }
}

declare module "express" {
  export interface Request{
    user?: HydratedDocument<IUser>
  }
}
