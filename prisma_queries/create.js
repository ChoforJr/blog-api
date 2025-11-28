import prisma from "../config/prisma.js";
import { Role } from "@prisma/client";

export async function insertAdmin(username, password, displayName, bio) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      role: Role.ADMIN,
      profile: {
        create: {
          displayName: displayName,
          bio: bio,
        },
      },
    },
  });
}

export async function insertUser(username, password, displayName) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          displayName: displayName,
        },
      },
    },
  });
}
