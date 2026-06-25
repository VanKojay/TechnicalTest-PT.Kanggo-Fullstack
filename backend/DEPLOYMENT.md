# Backend Deployment — Railway

Deploys the Express + Sequelize API to **Railway** (a persistent Node server — no
serverless changes needed). The database lives on **Supabase**; the frontend on **Vercel**.

> **Prerequisite:** finish the Supabase setup first (see the `...-Database` repo) and have
> your `DATABASE_URL` (pooler URI, port 6543) ready.

---

## Step 2 — Deploy to Railway

1. Go to <https://railway.app> → **New Project → Deploy from GitHub repo**.
2. Select the **`TechnicalTest-PT.Kanggo-Fullstack`** repo and authorize Railway if asked.
3. ⚠️ **Monorepo:** open the service → **Settings → Root Directory** and set it to **`backend`**.
4. Railway auto-detects Node (Nixpacks) and runs `npm install` → `npm start`.
   (Config is pinned in [`railway.json`](./railway.json).)

### Set environment variables

Open the service → **Variables** tab → add:

| Variable | Value |
|----------|-------|
| `DB_DIALECT` | `postgres` |
| `DATABASE_URL` | *(the Supabase pooler URI, port 6543)* |
| `JWT_SECRET` | *(a long random string)* |
| `JWT_EXPIRES_IN` | `24h` |
| `FRONTEND_URL` | *(your Vercel URL — fill after frontend deploy)* |
| `NODE_ENV` | `production` |

> `PORT` is provided by Railway automatically — the app reads `process.env.PORT`.
> Don't set it manually.

### Generate a public URL

**Settings → Networking → Generate Domain.** You'll get something like
`https://technicaltest-pt-kanggo-backend-production.up.railway.app`.

### Verify

- Health check: open `https://<your-backend>.up.railway.app/api/health` → `{ success: true }`
- API docs (Swagger): `https://<your-backend>.up.railway.app/api-docs`

### Seed the database (once)

In Railway → service → **⋮ → Run a command** (or local shell with the prod env):
```bash
npm run seed
```
This creates the demo users + tasks. ⚠️ Uses `sync({ force: true })` — it **drops and
recreates** tables, so only run on an empty/demo DB.

---

## After the frontend is live

Come back and set `FRONTEND_URL` to the exact Vercel URL (e.g.
`https://your-app.vercel.app`, no trailing slash) so CORS allows it, then redeploy.

---

## Notes
- Tables auto-create on boot via `sequelize.sync({ alter: true })` ([src/app.js](./src/app.js)).
- Postgres connections use SSL (`rejectUnauthorized: false`) — required by Supabase.
- Local dev still works with `DB_DIALECT=sqlite` (no external DB needed).
