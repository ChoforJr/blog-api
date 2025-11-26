import prisma from "../config/prisma.js";

export async function findUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      createdAt: true,
      role: true,
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
    },
    include: {
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
    },
    include: {
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

export async function findProfiles() {
  const profiles = await prisma.profile.findMany({});
  return profiles;
}

// export async function getFoldersByID(folderID) {
//   const folders = await prisma.folders.findUnique({
//     where: {
//       id: folderID,
//     },
//     include: {
//       files: true,
//     },
//   });
//   return folders;
// }

// export async function getFilesByFolderID(folderID) {
//   const files = await prisma.files.findMany({
//     where: {
//       foldersId: folderID,
//     },
//     include: {
//       folders: true,
//     },
//   });
//   return files;
// }

// export async function getFoldersByUserID(userID) {
//   const folders = await prisma.folders.findMany({
//     where: {
//       authorId: userID,
//     },
//   });
//   return folders;
// }

// export async function getFileByID(fileID) {
//   const file = await prisma.files.findUnique({
//     where: {
//       id: fileID,
//     },
//   });
//   return file;
// }

// export async function getAllFiles() {
//   const files = await prisma.files.findMany();
//   return files;
// }
