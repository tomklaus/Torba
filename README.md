# Torba Text Storage (Express + Vite)

This repository contains a React SPA built with Vite and an Express server. The server exposes REST endpoints for auth, profile management, and image uploads with NSFW moderation.

Key technologies: Express, Drizzle ORM (PostgreSQL), pg (TCP), Sharp, @tensorflow/tfjs-node, and NsfwSpy.

## Railway deployment notes

Railway runs your server in a regular Node.js environment. PostgreSQL is reachable via standard TCP — not WebSockets. This project is configured to use the `pg` driver exclusively.

- Database client: `pg` Pool over TCP
- ORM: Drizzle (`drizzle-orm/node-postgres`)
- Runtime: Node.js (Express server; no Edge runtime)

### Environment variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` — your Postgres connection string.
  - For production (Railway), include `?sslmode=require` if needed.
  - The server auto-enables `ssl: { rejectUnauthorized: false }` for non-local hosts.
- `IMGBB_API_KEY` — API key for ImgBB image hosting.
- `TF_CPP_MIN_LOG_LEVEL` (optional) — set to `2` to reduce TensorFlow native logs.

### Health and diagnostics

- `GET /api/health` — returns `{ status, node, db }` where `db` is `connected` or `unavailable`.
- On boot, the server performs a non-fatal Postgres `SELECT 1` health probe and logs the result.

### Error handling

All API routes wrap DB operations with defensive error handling. If the database is unavailable, endpoints return HTTP 503 with a JSON body:

```json
{ "message": "База даних недоступна" }
```

In particular, `POST /api/auth/check` will no longer return a 500 on transient DB failures; it returns 503 and logs the root cause. Other validation and not-found cases return appropriate 4xx statuses.

### NSFW model and TensorFlow

TensorFlow is initialized exactly once using a singleton initializer (`server/nsfw.ts`). The NSFW model (NsfwSpy) is also loaded once and reused.

- `TF_CPP_MIN_LOG_LEVEL=2` reduces TensorFlow native logs.
- The upload pipeline compresses images, uploads to ImgBB, and classifies them with the NSFW model.

## Development

- `npm run dev` — start Express with Vite in middleware mode (development)
- `npm run build` — build the client and server
- `npm start` — run the built server

## Database utilities

Lightweight migration helpers ensure required extensions and tables exist (idempotent):

- `npm run db:migrate` — ensures extensions/tables exist
- `npm run db:reset` — drops and recreates tables (destructive; prompts for confirmation)

## Project structure

- `server/` — Express server, routes, DB, upload and NSFW utilities
- `shared/` — Drizzle schema and shared types
- `client/` — React client app
- `lib/db/migrations.ts` — idempotent DB bootstrap (extensions, tables)
