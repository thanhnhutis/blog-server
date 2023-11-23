import { Router } from "express";
import OTPController from "../controllers/otp.controller";
import validateResource from "../middleware/validateResource";
import { sendOtpValidation } from "../validations/otp.validations";

class OTPRoutes {
  routes = Router();
  private controller = new OTPController();

  constructor() {
    this.intializeRoutes();
  }
  private intializeRoutes() {
    this.routes.post(
      "/send",
      validateResource(sendOtpValidation),
      this.controller.send
    );
  }
}

export default new OTPRoutes().routes;
