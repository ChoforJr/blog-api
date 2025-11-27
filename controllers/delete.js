import {
  deleteAllUsersExceptAdmin,
  deleteUserByID,
} from "../prisma_queries/delete.js";

export async function deleteUserSelf(req, res, next) {
  try {
    if (req.user.role == "ADMIN") {
      return res.sentStatus(400);
    }
    await deleteUserByID(req.user.id);
    res.sentStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function deleteUserByAdmin(req, res, next) {
  try {
    const userId = Number(req.params.id);
    await deleteUserByID(userId);
    res.sentStatus(200);
  } catch (err) {
    return next(err);
  }
}
