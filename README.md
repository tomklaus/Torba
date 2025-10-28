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
  - **Important**: Do NOT include `?sslmode=` parameters. The server handles SSL configuration explicitly.
  - For production (Railway), the server automatically enables SSL with self-signed certificate support.
  - SSL config: `{ rejectUnauthorized: false, checkServerIdentity: () => undefined }` for non-local hosts.
  - For local development, SSL is automatically disabled.
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
- `npm run db:seed` — creates a test user for development (username: `test_user`, email: `test@example.com`)

### Database schema

The database contains two main tables:

**users** table:
- `id` (varchar, UUID primary key)
- `username` (varchar(255), unique, not null) — auto-generated as `guest_<randomId>` if not provided
- `email` (text, unique, nullable)
- `created_at` (timestamp)

**profiles** table:
- Contains all user profile information from the 10-step registration flow
- Foreign key to `users(id)` with CASCADE delete
- Includes fields for personal info, commerce settings, photos, contacts, and sexual profile

On first boot, the server automatically:
1. Creates required PostgreSQL extensions (pgcrypto for UUID generation)
2. Creates tables if they don't exist
3. Migrates existing schemas (adds missing columns, adjusts constraints)
4. Validates and logs the database state

Schema validation logs show:
- List of existing tables
- Column structure of the users table
- Record counts for users and profiles

## Project structure

- `server/` — Express server, routes, DB, upload and NSFW utilities
- `shared/` — Drizzle schema and shared types
- `client/` — React client app
- `lib/db/migrations.ts` — idempotent DB bootstrap (extensions, tables)
