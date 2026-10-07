import "dotenv/config";
import cors from "cors";
import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import authRouter from "./routes/authRouter.js";
import { HttpError } from "./lib/auth.js";
import { validateRuntimeEnvironment } from "./config/environment.js";
import "./config/passport.js";

const runtimeEnvironment = validateRuntimeEnvironment();
const { allowedOrigins, port } = runtimeEnvironment;

const app = express();
const assetsPath = path.join(process.cwd(), "public");

app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
  }
  next();
});
app.use(
  cors({
    origin(origin, callback) {
      if (origin === undefined || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new HttpError("Origin is not allowed", 403));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.static(assetsPath));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", authRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const statusCode =
    error instanceof HttpError
      ? error.statusCode
      : typeof error === "object" &&
          error !== null &&
          "status" in error &&
          typeof error.status === "number"
        ? error.status
        : 500;
  const message =
    statusCode === 500
      ? "Internal Server Error"
      : error instanceof Error
        ? error.message
        : "Request failed";

  if (statusCode === 500) {
    console.error("Unhandled request error", error);
  }

  res.status(statusCode).json({
    error: {
      code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      message,
    },
    ...(process.env.NODE_ENV === "development" &&
    error instanceof Error &&
    statusCode === 500
      ? { details: error.message }
      : {}),
  });
};

app.use(errorHandler);

export { app, allowedOrigins, port };
