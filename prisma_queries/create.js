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

export async function createPost(
  title,
  content,
  published,
  userId,
  publishedAt
) {
  await prisma.post.create({
    data: {
      title: title,
      content: content,
      published: published,
      userId: userId,
      publishedAt: publishedAt,
    },
  });
}

export async function createComment(content, userId, postId, parentId) {
  const comment = await prisma.comment.createManyAndReturn({
    data: {
      content: content,
      userId: userId,
      postId: postId,
      parentId: parentId,
    },
  });
  return comment;
}
