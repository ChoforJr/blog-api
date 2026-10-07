import prisma from "../config/prisma.js";
import { Role } from "@prisma/client";

export async function createAdmin(
  username: string,
  password: string,
  displayName: string,
  bio: string
) {
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

export async function createUser(
  username: string,
  password: string,
  displayName: string
) {
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
  title: string,
  content: string,
  published: boolean,
  userId: number,
  publishedAt: Date | null
) {
  const post = await prisma.post.createManyAndReturn({
    data: {
      title: title,
      content: content,
      published: published,
      userId: userId,
      publishedAt: publishedAt,
    },
  });
  return post;
}

export async function createComment(
  content: string,
  userId: number,
  postId: number
) {
  const comment = await prisma.comment.createManyAndReturn({
    data: {
      content: content,
      userId: userId,
      postId: postId,
    },
  });
  return comment;
}
