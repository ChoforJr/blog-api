import {
  findAdmin,
  findUsers,
  findUserByID,
  findProfileByUserID,
  findPosts,
  findPublishedPosts,
} from "../prisma_queries/find.js";

export function checkIfUserIsAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.json({
      error: "You are not authorized to access this information",
    });
  } else {
    return next();
  }
}

export async function readAdmin(req, res, next) {
  try {
    const adminInfo = await findAdmin();
    res.json({ adminInfo });
  } catch (err) {
    return next(err);
  }
}

export async function readAdminProfile(req, res, next) {
  try {
    const adminInfo = await findAdmin();
    const adminProfile = adminInfo.profile;
    res.json({ adminProfile });
  } catch (err) {
    return next(err);
  }
}

export async function readUsers(req, res, next) {
  try {
    const users = await findUsers();
    res.json({ users });
  } catch (err) {
    return next(err);
  }
}

export async function readUserByID(req, res, next) {
  try {
    const user = await findUserByID(req.user.id);
    if (!user) {
      return res.json({
        error: "This user doesn't exist",
      });
    }
    res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export async function readProfileByUserId(req, res, next) {
  try {
    const profile = await findProfileByUserID(Number(req.params.id));
    if (!profile) {
      return res.json({
        error: "This user doesn't exist",
      });
    }
    res.json({ profile });
  } catch (err) {
    return next(err);
  }
}

export async function readPosts(req, res, next) {
  try {
    const posts = await findPosts();
    res.json({ posts });
  } catch (err) {
    return next(err);
  }
}

export async function readPublishedPosts(req, res, next) {
  try {
    const publishedPosts = await findPublishedPosts();
    res.json({ publishedPosts });
  } catch (err) {
    return next(err);
  }
}
