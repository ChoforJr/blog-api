import prisma from "../config/prisma.js";

export async function updateBio(userId, newBio) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      bio: newBio,
    },
  });
}

export async function updateDisplayName(userId, newDisplayName) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      displayName: newDisplayName,
    },
  });
}

export async function updateUsername(userId, newUsername) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUsername,
    },
  });
}

export async function updatePassword(userId, newPassword) {
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
  postId,
  title,
  content,
  published,
  publishedAt
) {
  await prisma.post.update({
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

export async function updatePostState(postId, published, publishedAt) {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: published,
      publishedAt: publishedAt,
    },
  });
}
