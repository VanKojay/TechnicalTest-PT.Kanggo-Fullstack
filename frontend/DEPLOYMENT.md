# Frontend Deployment — Vercel

Deploys the React + Vite SPA to **Vercel**. It talks to the Railway backend via the
`VITE_API_URL` environment variable.

> **Prerequisite:** the backend should be live on Railway first so you have its URL.

---

## Step 3 — Deploy to Vercel

1. Go to <https://vercel.com> → **Add New → Project → Import Git Repository**.
2. Select the **`TechnicalTest-PT.Kanggo-Fullstack`** repo.
3. ⚠️ **Monorepo:** set **Root Directory** to **`frontend`** (in the import config screen).
4. Vercel auto-detects **Vite**. Defaults are correct (also pinned in
   [`vercel.json`](./vercel.json)):
   - Build command: `npm run build`
   - Output directory: `dist`

### Set environment variable

Before deploying (or under **Settings → Environment Variables**):

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://<your-backend>.up.railway.app` |

> No trailing slash. Vite inlines `VITE_*` vars at **build time**, so after changing it
> you must **redeploy** for it to take effect.

4. Click **Deploy**. You'll get a URL like `https://your-app.vercel.app`.

### SPA routing
`vercel.json` rewrites all paths to `/index.html` so React Router routes (e.g.
`/login`, `/dashboard`) work on refresh / direct access.

---

## Step 4 — Close the loop (CORS)

Copy your Vercel URL and set it as `FRONTEND_URL` in the **Railway backend** variables,
then redeploy the backend. Otherwise the browser blocks API calls with a CORS error.

---

## Verify
1. Open the Vercel URL → login with `budi@kanggo.com` / `password123`.
2. If login fails, open DevTools → Network:
   - **CORS error** → fix `FRONTEND_URL` on Railway.
   - **404 / wrong host** → fix `VITE_API_URL` on Vercel and redeploy.
