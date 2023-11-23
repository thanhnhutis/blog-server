import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import UserController from "../controllers/user.controller";
import checkCsrf from "../middleware/checkCSRF";
import checkRole from "../middleware/checkRole";
import validateResource from "../middleware/validateResource";
import {
  createUserValidation,
  editProfileValidation,
  editUserValidation,
} from "../validations/user.validations";

class UserRoutes {
  routers = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.routers.get("/me", requiredAuth, this.controller.currentUser);
    this.routers.patch(
      "/:id",
      validateResource(editUserValidation),
      requiredAuth,
      checkCsrf,
      this.controller.edit
    );
    this.routers.patch(
      "/",
      validateResource(editProfileValidation),
      requiredAuth,
      checkCsrf,
      checkRole(["Admin", "Manager"]),
      this.controller.editProfile
    );
    this.routers.get(
      "/",
      requiredAuth,
      checkRole(["Admin", "Manager"]),
      this.controller.getAllUser
    );
    this.routers.post(
      "/",
      validateResource(createUserValidation),
      requiredAuth,
      checkCsrf,
      checkRole(["Admin", "Manager"]),
      this.controller.creatUser
    );
  }
}
export default new UserRoutes().routers;
