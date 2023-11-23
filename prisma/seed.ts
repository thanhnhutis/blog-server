import { hashPassword } from "../src/utils";
import prisma from "../src/utils/db";

async function seed() {
  await prisma.user.deleteMany();
  const hash = hashPassword("@Abc123123");
  const user = await prisma.user.create({
    data: {
      email: "gaconght001@gmail.com",
      password: hash,
      username: "Admin",
      role: "Admin",
      isActive: true,
    },
  });
}

seed();
