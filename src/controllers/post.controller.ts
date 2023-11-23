import { Response, Request } from "express";
import { CreatePostInput } from "../validations/post.validations";
import prisma from "../utils/db";
import { BadRequestError } from "../errors/bad-request-error";

export default class PostController {
  async createPost(
    req: Request<{}, {}, CreatePostInput["body"]>,
    res: Response
  ) {
    const { slug, tagId, authorId } = req.body;

    const slugExist = await prisma.post.findUnique({ where: { slug } });
    if (slugExist) throw new BadRequestError("slug has been used");

    const tagExist = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tagExist) throw new BadRequestError("tagId invalid");

    const authorExist = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!authorExist) throw new BadRequestError("authorId invalid");

    const newPost = await prisma.post.create({ data: req.body });

    return res.send(newPost);
  }
}
