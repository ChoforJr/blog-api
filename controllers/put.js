import {
  updateUsername,
  updatePassword,
  updateDisplayName,
  updateBio,
} from "../prisma_queries/update.js";
import { matchedData } from "express-validator";

export async function editUserName(req, res, next) {
  try {
    const { newUsername } = matchedData(req);
    await updateUsername(req.user.id, newUsername);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPassword(req, res, next) {
  try {
    const { newPassword } = matchedData(req);
    await updatePassword(req.user.id, newPassword);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editDisplayName(req, res, next) {
  try {
    const { newDisplayName } = matchedData(req);
    await updateDisplayName(req.user.id, newDisplayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editBio(req, res, next) {
  try {
    const { newBio } = matchedData(req);
    await updateBio(req.user.id, newBio);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
