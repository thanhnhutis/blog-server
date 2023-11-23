import { Request, Response } from "express";
import { SigninInput, SignupInput } from "../validations/auth.validations";
import prisma from "../utils/db";
import { BadRequestError } from "../errors/bad-request-error";
import { comparePassword, hashPassword } from "../utils";
import { signJWT } from "../utils/jwt";
import { signCsrf } from "../utils/csrf";
import dayjs from "dayjs";

export default class AuthController {
  async signin(req: Request<{}, {}, SigninInput["body"]>, res: Response) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) throw new BadRequestError("invalid email or password");
    if (!user.isActive)
      throw new BadRequestError(
        "Your account has been locked please contact the administrator"
      );

    if (!user.password || !(await comparePassword(user.password, password)))
      throw new BadRequestError("invalid email or password");

    const token = signJWT({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    console.log(req.method);

    return res
      .cookie("x-token", token, {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(30, "day").toDate(),
      })
      .send({
        csrf: signCsrf(),
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      });
  }
  async signup(req: Request<{}, {}, SignupInput["body"]>, res: Response) {
    const { email, password, code } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new BadRequestError("Uer already exists");
    const otp = await prisma.otp.findUnique({
      where: {
        verified: false,
        code_email: {
          code: code,
          email: email,
        },
      },
    });
    if (!otp) throw new BadRequestError("Email verification code has expired");

    const hash = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hash,
        username: email.split("@")[0] ?? email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        username: true,
      },
    });
    await prisma.otp.update({
      where: { id: otp.id },
      data: {
        verified: true,
      },
    });
    return res.send(newUser);
  }

  async setsession(req: Request, res: Response) {
    return res
      .cookie("test-cookie", "test-cookie-value", {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(30, "day").toDate(),
      })
      .send({ message: "oke" });
  }

  async getsession(req: Request, res: Response) {
    console.log(req.cookies["test-cookie"]);
    return res.send({ message: "oke" });
  }
}
