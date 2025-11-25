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

// export async function insertfolder(userId, title) {
//   await prisma.folders.create({
//     data: {
//       title: title,
//       authorId: userId,
//     },
//   });
// }

// export async function insertFiles(data) {
//   await prisma.files.createMany({
//     data,
//     skipDuplicates: true,
//   });
// }
