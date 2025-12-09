import prisma from "../config/prisma.js";

export async function findUsers() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      username: true,
      createdAt: true,
      role: true,
      profile: true,
    },
  });
  return users;
}

export async function findAdmin() {
  const user = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
      role: true,
      profile: true,
    },
  });
  return user;
}

export async function findUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  return user;
}

export async function findUserByID(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
      role: true,
      profile: true,
    },
  });
  return user;
}

export async function findProfileByUserID(userID) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
  });
  return profile;
}

export async function findPosts() {
  const posts = await prisma.post.findMany({});
  return posts;
}

export async function findPublishedPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  return posts;
}

export async function findPostByID(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  return post;
}

export async function findPublishedPostByID(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      published: true,
    },
  });
  return post;
}

export async function findCommentByID(commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  return comment;
}

export async function findCommentsByPostID(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });
  return comments;
}

export async function findComments() {
  const comments = await prisma.comment.findMany({});
  return comments;
}
