-- ============================================================
--  Kanggo Task Manager — Seed Data (PostgreSQL / Supabase)
-- ============================================================
--  Run AFTER schema.sql. Resets users & tasks, then inserts
--  2 demo users + 18 tasks.
--
--  Login credentials (both users):
--    budi@kanggo.com / password123   (12 tasks)
--    siti@kanggo.com / password123   (6 tasks)
--
--  The password column stores a bcrypt hash of "password123".
--  (Alternatively, run `npm run seed` from the backend repo —
--   that hashes passwords programmatically and is the canonical
--   seeding method.)
-- ============================================================

TRUNCATE TABLE tasks, users RESTART IDENTITY CASCADE;

-- ─── Users ──────────────────────────────────────────────────
INSERT INTO users (name, email, password) VALUES
  ('Budi Santoso', 'budi@kanggo.com', '$2b$10$32MjpKW/iU4WCjZrSI/4re2pqQM4CC6bNJM7cL9uChu0rmG1yZSTG'),
  ('Siti Rahayu',  'siti@kanggo.com', '$2b$10$32MjpKW/iU4WCjZrSI/4re2pqQM4CC6bNJM7cL9uChu0rmG1yZSTG');

-- ─── Tasks: Budi (user_id = 1) ──────────────────────────────
INSERT INTO tasks (title, description, status, deadline, user_id) VALUES
  ('Setup project repository', 'Inisialisasi repo GitHub dan setup branch strategy (main, develop, feature).', 'done', '2026-06-20', 1),
  ('Design database schema', 'Buat ERD dan tentukan relasi antar tabel untuk sistem task management.', 'done', '2026-06-21', 1),
  ('Implementasi REST API backend', 'Develop endpoint CRUD tasks dan autentikasi menggunakan Express.js dan JWT.', 'done', '2026-06-23', 1),
  ('Buat halaman login & register', 'Frontend form dengan validasi dan integrasi ke API auth.', 'in-progress', '2026-06-25', 1),
  ('Develop dashboard tugas', 'Halaman utama menampilkan list tugas dengan filter status dan live search.', 'in-progress', '2026-06-26', 1),
  ('Integrasi frontend dengan backend', 'Koneksi semua komponen React ke REST API menggunakan Axios.', 'pending', '2026-06-27', 1),
  ('Unit testing backend', 'Tulis minimal 5 test case untuk endpoint auth dan tasks menggunakan Jest.', 'pending', '2026-06-28', 1),
  ('Setup Docker & docker-compose', 'Containerize aplikasi backend, frontend, dan MySQL database.', 'pending', '2026-06-29', 1),
  ('Buat dokumentasi API (Swagger)', 'Dokumentasikan semua endpoint di Swagger UI agar mudah diuji.', 'pending', '2026-06-30', 1),
  ('Rekam video demo aplikasi', 'Record demo max 15 menit, upload ke YouTube (unlisted) untuk submission.', 'pending', '2026-07-01', 1),
  ('Review & refactor kode', 'Code review, clean up unused imports, tambah komentar pada logic kompleks.', 'pending', '2026-07-01', 1),
  ('Deploy ke Vercel + Railway', 'Deploy frontend ke Vercel dan backend ke Railway untuk demo online.', 'pending', NULL, 1);

-- ─── Tasks: Siti (user_id = 2) ──────────────────────────────
INSERT INTO tasks (title, description, status, deadline, user_id) VALUES
  ('Riset UI/UX best practices', 'Kumpulkan referensi desain modern untuk task management app.', 'done', '2026-06-19', 2),
  ('Wireframe halaman utama', 'Sketch layout dashboard, task card, dan navigation flow.', 'done', '2026-06-20', 2),
  ('Implementasi responsive design', 'Pastikan semua halaman responsive di mobile (375px) dan desktop.', 'in-progress', '2026-06-25', 2),
  ('Testing cross-browser', 'Test di Chrome, Firefox, dan Edge. Catat bug yang ditemukan.', 'pending', '2026-06-28', 2),
  ('Optimasi performa frontend', 'Lazy loading, code splitting, dan minifikasi assets.', 'pending', '2026-06-30', 2),
  ('Tulis README.md lengkap', 'Dokumentasi setup, fitur, screenshot, dan cara menjalankan aplikasi.', 'pending', NULL, 2);
