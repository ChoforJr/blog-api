import "dotenv/config";
import { hash } from "bcryptjs";
import prisma from "../config/prisma.js";
import { createAdmin } from "../prisma_queries/create.js";
import { findAdmin } from "../prisma_queries/find.js";

async function seedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const displayName = process.env.ADMIN_DISPLAY_NAME?.trim();

  if (!username || !password || !displayName) {
    throw new Error(
      "ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_DISPLAY_NAME are required"
    );
  }
  if (
    password.length < 12 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new Error("ADMIN_PASSWORD must be at least 12 and at most 72 bytes");
  }

  if (await findAdmin()) {
    console.log("An admin account already exists");
    return;
  }

  await createAdmin(username, await hash(password, 12), displayName, "");
  console.log("Admin account created");
}

try {
  await seedAdmin();
} catch (error) {
  console.error("Failed to seed admin account", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
