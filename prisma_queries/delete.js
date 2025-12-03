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

export async function deletePost(postId) {
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
}

export async function deleteAllPosts() {
  await prisma.post.deleteMany({});
}

export async function deleteAllDraftedPosts() {
  await prisma.post.deleteMany({
    where: {
      published: false,
    },
  });
}

export async function deleteCommentsOfAPost(postId) {
  await prisma.comment.deleteMany({
    where: {
      postId: postId,
    },
  });
}

export async function deleteAllComments() {
  await prisma.comment.deleteMany({});
}

export async function deleteComment(commentId) {
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
