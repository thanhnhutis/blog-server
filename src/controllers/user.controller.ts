import { Request, Response } from "express";
import prisma from "../utils/db";
import {
  CreateUserInput,
  EditProfileInput,
  EditUserInput,
} from "../validations/user.validations";
import { BadRequestError } from "../errors/bad-request-error";
import { hashPassword } from "../utils";

export default class UserController {
  async currentUser(req: Request, res: Response) {
    const { id } = res.locals.currentUser!;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        username: true,
      },
    });
    return res.send(user);
  }
  async editProfile(
    req: Request<{}, {}, EditProfileInput["body"]>,
    res: Response
  ) {
    const { id } = res.locals.currentUser!;
    const body = req.body;
    if (body.password) {
      body.password = hashPassword(body.password);
    }
    const userUpdate = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    });
    const { password, ...userNoPass } = userUpdate;
    return res.send({ ...userNoPass });
  }
  async edit(
    req: Request<EditUserInput["params"], {}, EditUserInput["body"]>,
    res: Response
  ) {
    const { id } = req.params;
    const body = req.body;
    if (body.password) {
      body.password = hashPassword(body.password);
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestError("use not exist");
    const userUpdate = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    const { password, ...userNoPass } = userUpdate;
    return res.send({ ...userNoPass });
  }
  async getAllUser(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    return res.send(
      users.map((u) => {
        const { password, ...userNoPass } = u;
        return { ...userNoPass };
      })
    );
  }
  async creatUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    const { email, password, ...other } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) throw new BadRequestError("email has been used");
    const hashPass = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPass,
        ...other,
      },
    });
    const { password: _, ...resData } = newUser;
    return res.send(resData);
  }
}
