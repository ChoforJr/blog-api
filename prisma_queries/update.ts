import prisma from "../config/prisma.js";

export async function updateBio(userId: number, newBio: string) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      bio: newBio,
    },
  });
}

export async function updateDisplayName(userId: number, newDisplayName: string) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      displayName: newDisplayName,
    },
  });
}

export async function updateUsername(userId: number, newUsername: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUsername,
    },
  });
}

export async function updatePassword(userId: number, newPassword: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
}

export async function updatePost(
  postId: number,
  title: string,
  content: string,
  published: boolean,
  publishedAt: Date | null
) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title: title,
      content: content,
      published: published,
      publishedAt: publishedAt,
    },
  });
}

export async function updatePostState(
  postId: number,
  published: boolean,
  publishedAt: Date | null
) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: published,
      publishedAt: publishedAt,
    },
  });
}

export async function updateComment(commentId: number, content: string) {
  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: content,
    },
  });
}
