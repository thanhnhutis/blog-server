import { RequestHandler as Middleware, Request } from "express";
import { PermissionError } from "../errors/permission-error";
import { verifyCsrf } from "../utils/csrf";

const checkCsrf: Middleware = (req, res, next) => {
  if (res.locals.csrf && verifyCsrf(res.locals.csrf)) {
    next();
  } else {
    throw new PermissionError();
  }
};

export default checkCsrf;
