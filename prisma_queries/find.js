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
