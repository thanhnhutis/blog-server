import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import otpRoutes from "./otp.routes";
import tagRoutes from "./tag.routes";

class Routes {
  router = Router();
  constructor() {
    this.router.use("/auth", authRoutes);
    this.router.use("/otp", otpRoutes);
    this.router.use("/users", userRoutes);
    this.router.use("/tags", tagRoutes);
  }
}

export default new Routes().router;
