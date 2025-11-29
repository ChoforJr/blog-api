import prisma from "../config/prisma.js";
import { Role } from "@prisma/client";

export async function createAdmin(username, password, displayName, bio) {
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

export async function createUser(username, password, displayName) {
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
