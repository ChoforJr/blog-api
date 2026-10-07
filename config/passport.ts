import { compare } from "bcryptjs";
import type { Request } from "express";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
} from "passport-jwt";
import type { JwtPayload } from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getAuthCookieNameForRequest,
  getCookieValue,
  getJwtSecret,
} from "../lib/auth.js";
import { findUserByID, findUserByUsername } from "../prisma_queries/find.js";
import type { AuthenticatedUser } from "../types/models.js";

async function verifyCallback(
  username: string,
  password: string,
  done: (error: Error | null, user?: Express.User | false) => void
): Promise<void> {
  try {
    const user = await findUserByUsername(username.toLowerCase());
    if (!user) {
      done(null, false);
      return;
    }

    const matches = await compare(password, user.password);
    if (!matches) {
      done(null, false);
      return;
    }

    done(null, {
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    done(
      error instanceof Error ? error : new Error("Authentication failed")
    );
  }
}

passport.use("login", new LocalStrategy(verifyCallback));

const cookieTokenExtractor = (request: Request): string | null => {
  const cookieName = getAuthCookieNameForRequest(
    request.originalUrl,
    request.get("origin")
  );
  return cookieName
    ? getCookieValue(request.headers.cookie, cookieName)
    : null;
};

passport.use(
  new JwtStrategy(
    {
      secretOrKey: getJwtSecret(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieTokenExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    },
    async (
      payload: JwtPayload & { user?: Pick<AuthenticatedUser, "id"> },
      done: (error: Error | null, user?: Express.User | false) => void
    ): Promise<void> => {
      if (
        !payload.user ||
        !Number.isSafeInteger(payload.user.id) ||
        payload.user.id < 1
      ) {
        done(null, false);
        return;
      }

      try {
        const currentUser = await findUserByID(payload.user.id);
        if (!currentUser) {
          done(null, false);
          return;
        }

        done(null, {
          id: currentUser.id,
          username: currentUser.username,
          role: currentUser.role,
        });
      } catch (error) {
        done(error instanceof Error ? error : new Error("Authentication failed"));
      }
    }
  )
);
