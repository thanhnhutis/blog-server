import "express";
import { UserAuth } from "./common.types";

declare global {
  namespace Express {
    interface Locals {
      currentUser?: UserAuth;
      csrf?: string;
    }
  }
}
