import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import {
  signinValidation,
  signupValidation,
} from "../validations/auth.validations";

class AuthRoutes {
  routes = Router();
  private controller = new AuthController();
  constructor() {
    this.intializeRoutes();
  }
  private intializeRoutes() {
    this.routes.post(
      "/signin",
      validateResource(signinValidation),
      this.controller.signin
    );
    this.routes.post(
      "/signup",
      validateResource(signupValidation),
      this.controller.signup
    );
    this.routes.post("/setsession", this.controller.setsession);
    this.routes.get("/getsession", this.controller.getsession);
  }
}
export default new AuthRoutes().routes;

// route.get("/get", (req, res) => {
//   res.send({
//     csrf: req.cookies["_csrf"],
//   });
// });

// route.get("/set", (req, res) => {
//   const csrf = signCsrf();

//   res
//     .cookie("_csrf", csrf, {
//       secure: false,
//       httpOnly: true,
//       sameSite: "none",
//     })
//     .send({ csrf });
// });

// route.get("/delete", (req, res) => {
//   console.log(verifyCsrf(req.cookies["_csrf"]));

//   res.clearCookie("_csrf").send("ok");
// });

// export default route;
