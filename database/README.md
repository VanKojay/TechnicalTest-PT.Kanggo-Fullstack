# Kanggo Task Manager — Database (Supabase / PostgreSQL)

Schema & seed data for the Kanggo Task Manager. The production database is hosted on
**Supabase** (managed PostgreSQL). The backend connects to it via a `DATABASE_URL`
connection string.

## Contents
| File | Purpose |
|------|---------|
| `schema.sql` | DDL for `users` + `tasks` tables (reference / manual provisioning) |
| `seed.sql`   | Demo data: 2 users + 18 tasks |

> ℹ️ The backend auto-creates tables on first boot via Sequelize `sync()`, so running
> `schema.sql` manually is **optional**. Seeding is recommended for the demo.

---

## Deployment Order (whole project)

```
1. Supabase  (database)   ← this folder (database/)
2. Railway   (backend)    ← ../backend    → needs Supabase DATABASE_URL
3. Vercel    (frontend)   ← ../frontend   → needs Railway backend URL
4. Update Railway FRONTEND_URL with the Vercel URL (for CORS)
```

---

## Step 1 — Create the Supabase database

1. Go to <https://supabase.com> → **New project**.
2. Set a **Project name** and a strong **Database password** (save it — you'll need it).
3. Pick the region closest to your Railway region, then **Create**.
4. Wait until the project finishes provisioning.

### Get the connection string (for the backend)

1. **Project Settings → Database → Connection string → URI**.
2. ⚠️ Toggle **"Use connection pooler"** and copy the **Transaction pooler** URI.
   It looks like:
   ```
   postgresql://postgres.abcdxyz:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   - Host ends with `pooler.supabase.com`, port **6543** (NOT 5432).
   - Replace `[YOUR-PASSWORD]` with the DB password from step 2.
3. Keep this URI — it becomes `DATABASE_URL` in the Railway backend env vars.

> The pooler (port 6543) is important: each backend instance opens a connection, and
> the pooler prevents exhausting Supabase's connection limit.

### (Optional) Load schema & seed manually

In Supabase → **SQL Editor**, paste and run `schema.sql`, then `seed.sql`.
Or just run `npm run seed` from the backend once it's connected — that's the
canonical seeding method.

---

## Demo login credentials

| Email | Password | Tasks |
|-------|----------|-------|
| `budi@kanggo.com` | `password123` | 12 |
| `siti@kanggo.com` | `password123` | 6  |

---

## Schema overview

**users**: `id`, `name`, `email` (unique), `password` (bcrypt), `createdAt`, `updatedAt`
**tasks**: `id`, `title`, `description`, `status` (`pending`|`in-progress`|`done`),
`deadline`, `user_id` → `users.id` (CASCADE), `createdAt`, `updatedAt`
