import "dotenv/config";
import { getJwtSecret } from "../lib/auth.js";

const localOrigins = ["http://localhost:3000", "http://localhost:3001"];

function normalizeOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid frontend origin: ${value}`);
  }

  if (
    url.origin !== value ||
    url.username !== "" ||
    url.password !== "" ||
    (url.protocol !== "http:" && url.protocol !== "https:")
  ) {
    throw new Error(`Frontend origins must be bare HTTP(S) origins: ${value}`);
  }

  return url.origin;
}

export function getAllowedOrigins(
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const configuredOrigins = [env.ALLOWED_URL1, env.ALLOWED_URL2]
    .filter((origin): origin is string => Boolean(origin?.trim()))
    .map((origin) => normalizeOrigin(origin.trim()));

  if (env.NODE_ENV === "production") {
    if (
      configuredOrigins.length !== 2 ||
      new Set(configuredOrigins).size !== 2 ||
      configuredOrigins.some((origin) => !origin.startsWith("https://"))
    ) {
      throw new Error(
        "Production requires two distinct HTTPS frontend origins in ALLOWED_URL1 and ALLOWED_URL2"
      );
    }

    return configuredOrigins;
  }

  return configuredOrigins.length > 0 ? configuredOrigins : localOrigins;
}

export function validateRuntimeEnvironment(
  env: NodeJS.ProcessEnv = process.env
): { allowedOrigins: string[]; port: number } {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be configured");
  }

  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
  }
  if (
    parsedDatabaseUrl.protocol !== "postgres:" &&
    parsedDatabaseUrl.protocol !== "postgresql:"
  ) {
    throw new Error("DATABASE_URL must use the PostgreSQL protocol");
  }

  const jwtSecret = env.JWT_SECRET ?? env.SECRET_KEY;
  if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes");
  }

  const port = Number(env.PORT ?? 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return { allowedOrigins: getAllowedOrigins(env), port };
}
