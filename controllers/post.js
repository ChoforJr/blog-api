import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { createAdmin, createUser } from "../prisma_queries/create.js";
import { findAdmin } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";

async function addAdmin() {
  try {
    const checkAdmin = await findAdmin();
    if (checkAdmin) {
      return console.log("Admin Already exist");
    }
    const username = "choforjrforsakang@gmail.com";
    const password = `${process.env.ADMIN_PASSWORD}`;
    const displayName = "Chofor J. Forsakang";
    const bio = "This is the profile of the admin";
    const hashedPassword = await hash(password, 10);
    await createAdmin(username, hashedPassword, displayName, bio);
    return console.log("Admin created");
  } catch (err) {
    return console.error(err);
  }
}
addAdmin();

export async function addNewUser(req, res, next) {
  try {
    const { username, password, displayName } = matchedData(req);
    const hashedPassword = await hash(password, 10);
    const usernameLowerCase = username.toLowerCase();
    await createUser(usernameLowerCase, hashedPassword, displayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
