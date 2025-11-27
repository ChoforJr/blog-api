import prisma from "../config/prisma.js";

export async function deleteAllUsersExceptAdmin() {
  await prisma.user.deleteMany({
    where: {
      role: "USER",
    },
  });
}

export async function deleteUserByID(userID) {
  await prisma.user.delete({
    where: {
      id: userID,
    },
  });
}
