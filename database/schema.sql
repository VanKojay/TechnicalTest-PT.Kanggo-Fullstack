-- ============================================================
--  Kanggo Task Manager — PostgreSQL Schema (Supabase)
-- ============================================================
--  NOTE: The backend (Sequelize) auto-creates these tables on
--  first boot via sequelize.sync({ alter: true }). Running this
--  file manually is OPTIONAL — useful for reviewing the schema
--  or provisioning the DB before the backend starts.
--
--  Column names "createdAt"/"updatedAt" are quoted to match the
--  camelCase identifiers Sequelize generates.
-- ============================================================

-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hash
  "createdAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Tasks ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'in-progress', 'done')),
  deadline    DATE,
  user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status  ON tasks (status);
