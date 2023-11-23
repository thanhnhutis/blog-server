import { RequestHandler as Middleware } from "express";
import { verifyJWT } from "../utils/jwt";
import prisma from "../utils/db";

const deserializeUser: Middleware = async (req, res, next) => {
  const accessToken = req.cookies["x-token"];
  console.log(req.cookies);
  const csrfToken = (
    req.headers.authorization ||
    req.header("Authorization") ||
    ""
  ).replace(/^Bearer\s/, "");
  if (!accessToken && !csrfToken) return next();
  if (csrfToken) {
    res.locals.csrf = csrfToken;
  }
  // check cookie do logout chua
  // neu logout thi cho vao redis black list
  // neu cookie o black list thi xoa cookie va next
  const decoded = verifyJWT<{ id: string }>(
    accessToken,
    process.env.JWT_SECRET!
  );

  if (decoded) {
    const user = await prisma.user.findFirst({
      where: { id: decoded.id, isActive: true },
    });
    if (user) {
      res.locals.currentUser = {
        avatarUrl: user.avatarUrl,
        email: user.email,
        id: user.id,
        isActive: user.isActive,
        role: user.role,
        username: user.username,
      };
    }
  }
  return next();
};
export default deserializeUser;
