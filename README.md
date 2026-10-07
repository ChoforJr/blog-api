# Blog API

The independently deployed Express API for the Blog ecosystem. The public client and admin client remain separate frontend repositories and Vercel projects; this backend remains independently deployed to Render.

## Stack and features

- Node.js 20+, Express 5, strict TypeScript, PostgreSQL, and Prisma
- User/admin roles; bcrypt password hashing; JWT authentication in an HttpOnly cookie
- Request validation, allowlisted credentialed CORS, and protected user/admin routes
- WebSocket events for published post and comment changes

## Local development

1. Install Node.js 20+ and npm, then run `npm ci`.
2. Copy `.env.example` to `.env` and configure the database, JWT secret, and frontend origins.
3. Generate Prisma Client and apply migrations with `npm run prismaGen` and the repository's migration workflow.
4. Start development mode with `npm run dev`.

Useful scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Watch and run the TypeScript HTTP/WebSocket server |
| `npm run typecheck` | Check the strict TypeScript project |
| `npm run build` | Generate Prisma Client and compile to `dist/` |
| `npm start` | Run the compiled production server |
| `npm run prismaDeploy` | Apply checked-in migrations to the configured database |
| `npm run seed:admin` | Create the initial admin from explicit environment values |

The admin seed is an explicit command; starting the API never creates an account or uses a built-in username/password.

## Environment

See `.env.example`. At startup the API validates `DATABASE_URL` (PostgreSQL URL), a cryptographically random `JWT_SECRET` with at least 32 bytes, a valid `PORT`, and frontend origins. Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`. Local development defaults to `http://localhost:3000` and `http://localhost:3001`; set `ALLOWED_URL1` and `ALLOWED_URL2` to override them. New sign-up and password-change requests require passwords of at least 12 characters (maximum 72 UTF-8 bytes). Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_DISPLAY_NAME` only when deliberately running the admin seed.

### Render, Neon, and Vercel deployment

- Create a Render Node web service with Node.js 20 or newer. Set the build command to `npm ci --include=dev && npm run build` and the start command to `npm start`; Render supplies `PORT`. The explicit `--include=dev` matters because TypeScript, Prisma CLI, and the `@types/*` compiler declarations are build-time dev dependencies; a production-only install omits them and reproduces the missing declaration errors in the deployment log. The production TypeScript build excludes the test directory; tests run separately with `npm test`. Configure `npm run prismaDeploy` as the Render pre-deploy/release command so migrations are applied before the new server starts.
- Set `NODE_ENV=production`, `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ALLOWED_URL1`, and `ALLOWED_URL2` in the Render service environment. Use Neon’s pooled connection URL for runtime `DATABASE_URL` and its direct connection URL for Prisma migrations as `DIRECT_URL`; retain `sslmode=require` on both. `DIRECT_URL` falls back to `DATABASE_URL` for local development. Do not commit production values or place them in either frontend's `NEXT_PUBLIC_*` variables.
- Set `ALLOWED_URL1` and `ALLOWED_URL2` to the exact origins of the public and admin Vercel deployments, including `https://` and no trailing slash or path (for example, `https://blog.example.com`). Production startup rejects missing, duplicate, non-HTTPS, or non-origin values. Preview deployments are intentionally not allowed unless their exact origin is configured.
- Apply database migrations with `npm run prismaDeploy` after configuring the Neon direct connection and before serving traffic. Render's pre-deploy/release command runs this migration against `DIRECT_URL`. Run `npm run seed:admin` separately only when creating the first administrator.
- The API enables credentialed CORS for only those exact origins and responds to preflight requests. Set `ALLOWED_URL1` to the public/user Vercel origin and `ALLOWED_URL2` to the admin Vercel origin; the order is used to clear the matching session on logout. Both browser clients must send credentialed requests. Local frontends on ports `3000` (user) and `3001` (admin) are allowed by default in development.

The login endpoint scopes the HttpOnly session cookie to the calling frontend: `blog_user_session` for the public client and `blog_admin_session` for the admin client. These distinct cookies are important because browsers share cookies across local ports and both Vercel apps call the same API origin. The API selects the cookie from the allowlisted request origin, with route-based selection for non-browser callers; `/user/*` and `/admin/*` endpoints still enforce the account's current database role. Thus one app's login cannot silently become the other app's comment author. Logout clears the matching client's session based on its allowed origin. The legacy shared `blog_session` cookie is ignored and cleared on the next login/logout; after deploying this change, sign in again in each frontend. Production cookies require HTTPS and use `SameSite=None; Secure` so separately hosted frontends can send them; local development uses `SameSite=Lax`. The API looks up the user on every JWT-authenticated request and uses the current database username and role, so role changes take effect without re-login. Requests without a valid client-scoped JWT receive `401`; authenticated users without the admin role receive `403`. Browser privacy settings may still block third-party cookies when Vercel and Render use unrelated domains; use a same-site custom domain/reverse proxy if that occurs. The API temporarily accepts bearer JWTs and returns a token for rollout compatibility with existing clients.

Post create/update validation accepts JSON booleans and the legacy `"true"`/`"false"` string values for `published`. Titles may contain punctuation and remain limited to 4–32 trimmed characters. Prisma date values are serialized to ISO strings for WebSocket events; ordinary JSON responses use Express's ISO serialization for `Date` values.

## HTTP API

Public:

- `POST /signup`, `POST /login`, `POST /logout`
- `GET /profiles`
- `GET /post`, `GET /post/:id`, `GET /post/:id/comments`
- `GET /comments`

Authenticated user (`/user`):

- `GET /user/myProfile`, `GET /user/profile/:id`, `GET /user/profile/admin`
- `PUT /user/username`, `/password`, `/displayName`, `/bio`
- `DELETE /user/myProfile`
- `POST /user/post/:id/comment`
- `PUT` or `DELETE /user/post/comment/:id`

Admin (`/admin`, requires the `ADMIN` role):

- `GET /admin/profile`, `/admin/users`, `/admin/post/all`
- `POST /admin/post`; `PUT /admin/post/:id` and `/admin/post/state/:id`
- `DELETE /admin/user/:id`, `/admin/users`
- `DELETE /admin/post/:id`, `/admin/post/all`, `/admin/post/drafted`
- `DELETE /admin/post/comment/:id`, `/admin/post/:id/comments`, `/admin/comments/all`

The existing route payloads remain compatible with the current clients. `types/` defines the stricter TypeScript target contracts for the migration; the response-envelope contracts are not yet a uniform runtime wrapper.

## WebSocket

Connect to `wss://<api-host>/ws` in production or `ws://localhost:<port>/ws` locally. The server validates browser origins against the same allowlist as HTTP and accepts JSON event frames:

```json
{"event":"post:subscribe","payload":{"postId":42}}
```

Clients may also send `post:unsubscribe`. Server events are `post:published`, `post:updated`, `post:deleted`, `posts:refresh`, `comment:created`, `comment:updated`, `comment:deleted`, and `comments:refresh`. Publishing is broadcast to connected clients; post-specific and comment events are limited to clients subscribed to that post. Reconnect and resubscribe from the frontend after a dropped connection.

## Project layout

```text
app.ts                    # Express middleware and HTTP routes
server.ts                 # HTTP server and WebSocket upgrade handling
config/                   # Prisma and Passport configuration
controllers/              # Route handlers
lib/                      # Authentication and transport serializers
middleware/               # Authorization middleware
prisma/                   # Database schema, migrations, and explicit seed
prisma_queries/           # Typed Prisma operations
routes/                   # Public, user, and admin routers
types/                    # Domain, HTTP, Express, and WebSocket contracts
validations/              # Request validation
websocket/                # Typed WebSocket event handling
```

## Related deployments

- User-facing frontend: `user-client-blog-api` (separate Vercel project/repository)
- Admin frontend: `admin-client-blog-api` (separate Vercel project/repository)
- This API: `blog-api` (separate Render service/repository)

Each application can be released independently. Keep API response shapes backward-compatible until both frontend deployments have been migrated.
