import {
  findAdmin,
  findUsers,
  findUserByID,
  findProfileByUserID,
  findProfiles,
} from "../prisma_queries/find.js";

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
    const user = await findUserByID(req.params.id);
    res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export async function readProfileByUserId(req, res, next) {
  try {
    const profile = await findProfileByUserID(req.params.id);
    res.json({ profile });
  } catch (err) {
    return next(err);
  }
}

export async function readProfiles(req, res, next) {
  try {
    const profiles = await findProfiles();
    res.json({ profiles });
  } catch (err) {
    return next(err);
  }
}
