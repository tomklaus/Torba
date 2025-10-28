# Database Schema Fix - Changelog

## Problem
- Database had old schema with `username` column but code didn't provide it
- Error: "null value in column 'username' of relation 'users' violates not-null constraint"
- Schema bootstrap used `CREATE TABLE IF NOT EXISTS` which didn't update existing tables

## Solution Implemented

### 1. Updated Schema Definition (`shared/schema.ts`)
- Added `username` field to users table (varchar(255), unique, not null)
- Made `email` field nullable (changed from `notNull()`)
- Updated `insertUserSchema` to make both email and username optional (for auto-generation)

### 2. Enhanced Migrations (`lib/db/migrations.ts`)
- Updated `ensureTables()` to create users table with username column
- Added migration logic to add username column to existing tables
- Added migration to make email nullable on existing tables
- Added index on username column for performance
- Created `validateSchema()` function to log database state on startup:
  - Lists all tables in public schema
  - Shows column structure of users table
  - Displays record counts

### 3. User Creation with Auto-Generated Usernames (`server/storage.ts`)
- Added `generateUsername()` method that creates `guest_<randomId>` usernames
- Updated `createUser()` to auto-generate username if not provided
- Implemented retry logic for username collisions (up to 5 attempts)
- Handles unique constraint violations gracefully

### 4. API Endpoint Updates (`server/routes.ts`)
- Updated POST `/api/auth/check` to accept optional username in request body
- Added specific error handling for username conflicts (409 status)
- Passes username through to storage layer

### 5. Server Startup (`server/index.ts`)
- Added call to `validateSchema()` after `ensureTables()`
- Logs detailed database state information on boot

### 6. Database Utilities
- Created `src/scripts/dbSeed.ts` to create test user
- Added `npm run db:seed` command to package.json
- Updated README with database schema documentation

### 7. Documentation (`README.md`)
- Added detailed database schema section
- Documented all database utilities
- Explained auto-generated username behavior
- Listed schema validation output

## Breaking Changes
None - changes are backward compatible:
- Existing users without username will get one auto-generated during migration
- New users can optionally provide username or get auto-generated one
- Email is now optional (can create users with just username)

## Migration Path
For existing databases:
1. On server startup, `ensureTables()` runs automatically
2. Checks if username column exists, adds it if missing (with default value)
3. Makes email nullable if it isn't already
4. Existing users get `guest_<uuid>` usernames
5. No manual intervention needed

For fresh databases:
1. Tables are created with correct schema
2. Ready to use immediately

## Testing
To verify the fix:
1. Start server - check logs for schema validation output
2. POST to `/api/auth/check` with email only - username should be auto-generated
3. POST to `/api/auth/check` with email and username - should use provided username
4. Run `npm run db:seed` to create test user

## Acceptance Criteria Met
✓ All required tables (users, profiles) are created on first boot
✓ Startup logs list created tables and confirm they exist
✓ POST /api/auth/check successfully creates user with valid username (generated or from request)
✓ No "null value in column username" errors
✓ GET/POST endpoints work end-to-end with authenticated users
✓ Database can be seeded with test user using `npm run db:seed`
