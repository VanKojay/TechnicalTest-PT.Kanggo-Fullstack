# TaskFlow — Task Management System

Aplikasi Task Management System fullstack yang memungkinkan pengguna untuk mengelola tugas-tugas pribadi dengan fitur autentikasi dan CRUD.

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Node.js + Express.js |
| Frontend | React.js (Vite) + Tailwind CSS |
| Database | SQLite (dev) / MySQL / PostgreSQL — via Sequelize ORM |
| Auth | JWT + bcrypt |
| API Docs | Swagger (OpenAPI 3.0) |
| Testing | Jest + Supertest |
| Container | Docker + docker-compose |
| Deployment | Vercel (frontend) · Railway (backend) · Supabase (PostgreSQL) |

---

## 🚀 Langkah-Langkah Menjalankan Aplikasi (Dari 0)

### Prerequisites

Pastikan sudah terinstall di komputer Anda:

- **Node.js** >= 18 ([download](https://nodejs.org/))
- **MySQL** >= 8.0 ([download](https://dev.mysql.com/downloads/))
- **npm** (otomatis terinstall bersama Node.js)
- **Git** ([download](https://git-scm.com/))

### Step 1: Clone Repository

```bash
git clone <repo-url>
cd Fullstack
```

---

### Step 2: Setup Database

Aplikasi mendukung **3 pilihan database** (via Sequelize). Pilih salah satu:

#### Opsi A — SQLite (paling cepat, tanpa instalasi DB) ✅ direkomendasikan untuk dev

Tidak perlu setup apa pun. Di file `.env` cukup pakai:

```env
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
```

Database file akan dibuat otomatis saat backend pertama kali jalan.

#### Opsi B — MySQL

Buka MySQL client (terminal, MySQL Workbench, phpMyAdmin, atau HeidiSQL), lalu jalankan:

```sql
CREATE DATABASE kanggo_taskmanager;
```

> **Note:** Pastikan MySQL service berjalan di port `3306`, lalu set `DB_DIALECT=mysql` di `.env`.

#### Opsi C — PostgreSQL / Supabase (untuk production)

Lihat panduan lengkap di [`database/README.md`](database/README.md) dan bagian
**Deployment Online** di bawah.

---

### Step 3: Setup Backend

#### 3.1 Masuk ke folder backend

```bash
cd backend
```

#### 3.2 Install dependencies

```bash
npm install
```

#### 3.3 Konfigurasi environment variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian edit file `.env`. Contoh untuk **SQLite** (paling mudah):

```env
PORT=5000

# Database — sqlite (dev, tanpa setup), mysql, atau postgres
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

JWT_SECRET=ganti_dengan_secret_key_anda
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

Atau untuk **MySQL**, ganti bagian database menjadi:

```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=              # isi password MySQL Anda (kosongkan jika tidak ada)
DB_NAME=kanggo_taskmanager
```

> **Penting:** Untuk MySQL, sesuaikan `DB_USER` dan `DB_PASS` dengan credentials di komputer Anda.

#### 3.4 Jalankan seed data (opsional, untuk data dummy)

```bash
npm run seed
```

Ini akan membuat tabel dan mengisi database dengan data dummy:
- **2 user** dan **18 task** dengan berbagai status
- Login credentials:
  - `budi@kanggo.com` / `password123` (12 tasks)
  - `siti@kanggo.com` / `password123` (6 tasks)

> **Note:** Perintah seed akan **menghapus semua data** yang ada dan membuat ulang dari awal.

#### 3.5 Jalankan backend server

```bash
# Development mode (auto-restart saat ada perubahan)
npm run dev

# Atau production mode
npm start
```

✅ Backend berjalan di **http://localhost:5000**

#### 3.6 Verifikasi backend berjalan

Buka browser dan akses:
- Health check: http://localhost:5000/api/health
- API Docs (Swagger): http://localhost:5000/api-docs

---

### Step 4: Setup Frontend

#### 4.1 Buka terminal baru, masuk ke folder frontend

```bash
cd frontend
```

#### 4.2 Install dependencies

```bash
npm install
```

#### 4.3 Jalankan frontend dev server

```bash
npm run dev
```

✅ Frontend berjalan di **http://localhost:5173**

---

### Step 5: Buka Aplikasi

1. Buka browser ke **http://localhost:5173**
2. **Register** akun baru, atau **Login** dengan akun dummy (jika sudah menjalankan seed):
   - Email: `budi@kanggo.com` | Password: `password123`
   - Email: `siti@kanggo.com` | Password: `password123`
3. Mulai kelola tugas! 🎉

---

## 📋 Ringkasan Perintah

```bash
# === BACKEND ===
cd backend
npm install                 # Install dependencies
cp .env.example .env        # Copy dan edit environment variables
npm run seed                # (Opsional) Isi data dummy
npm run dev                 # Jalankan development server

# === FRONTEND ===
cd frontend
npm install                 # Install dependencies
npm run dev                 # Jalankan development server

# === TESTING ===
cd backend
npm test                    # Jalankan unit test
```

---

## 🐳 Menjalankan dengan Docker (Alternatif)

Jika Anda memiliki Docker terinstall, cukup jalankan:

```bash
docker-compose up --build
```

Ini akan otomatis:
- Setup MySQL database
- Build dan jalankan backend (port 5000)
- Build dan jalankan frontend (port 3000)

---

## ☁️ Deployment Online

Aplikasi ini dirancang untuk di-deploy dengan stack berikut (semua punya free tier):

| Komponen | Platform | Panduan |
|----------|----------|---------|
| **Database** | Supabase (PostgreSQL) | [`database/README.md`](database/README.md) |
| **Backend** | Railway | [`backend/DEPLOYMENT.md`](backend/DEPLOYMENT.md) |
| **Frontend** | Vercel | [`frontend/DEPLOYMENT.md`](frontend/DEPLOYMENT.md) |

**Urutan deploy:**

```
1. Supabase  → buat database, ambil DATABASE_URL (connection pooler, port 6543)
2. Railway   → deploy backend (Root Directory: backend), isi env DATABASE_URL + JWT_SECRET
3. Vercel    → deploy frontend (Root Directory: frontend), isi env VITE_API_URL = URL backend
4. Railway   → set FRONTEND_URL = URL Vercel (agar CORS lolos), redeploy
```

> Karena ini **monorepo**, pada Railway & Vercel set **Root Directory** ke `backend` / `frontend`.
> Detail lengkap ada di masing-masing file `DEPLOYMENT.md`.

---

## 📚 API Documentation

Setelah backend berjalan, akses Swagger UI di:
```
http://localhost:5000/api-docs
```

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user baru | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |
| GET | `/api/tasks` | Get semua task (filter, search, pagination) | ✅ |
| POST | `/api/tasks` | Buat task baru | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Hapus task | ✅ |

### Query Parameters (GET /api/tasks)

| Parameter | Deskripsi | Contoh |
|-----------|-----------|--------|
| `status` | Filter berdasarkan status | `?status=pending` |
| `search` | Cari berdasarkan judul | `?search=deploy` |
| `page` | Nomor halaman (default: 1) | `?page=2` |
| `limit` | Item per halaman (default: 10, max: 50) | `?limit=5` |

---

## ✨ Fitur

### Fitur Utama
- ✅ Register & Login dengan JWT
- ✅ CRUD Tugas (Create, Read, Update, Delete)
- ✅ Filter tugas berdasarkan status (Pending, In Progress, Done)
- ✅ Proteksi route (hanya user login yang bisa akses)
- ✅ Responsive design (mobile & desktop)
- ✅ Konfirmasi sebelum hapus task

### Fitur Tambahan (Nilai Plus)
- ✅ **Quick Login** — tombol login 1-klik untuk akun demo di halaman login (tanpa ketik email/password)
- ✅ Live search berdasarkan judul (debounce 300ms)
- ✅ Pagination
- ✅ Validasi input di backend (express-validator) dan frontend
- ✅ Swagger API documentation
- ✅ Unit test (Jest + Supertest — 12 test cases)
- ✅ Docker support (docker-compose)
- ✅ Seed data untuk demo
- ✅ Multi-database (SQLite / MySQL / PostgreSQL) via Sequelize
- ✅ Siap deploy: Vercel + Railway + Supabase (lihat bagian Deployment)

---

## 🧪 Testing

```bash
cd backend
npm test
```

Test mencakup:
- Auth: register (success, duplicate, invalid email, short password)
- Auth: login (success, wrong password, non-existent email)
- Task: create (success, no title, no auth)
- Task: get all, filter by status
- Task: update (success, not found)
- Task: delete (success, already deleted)

---

## 📁 Struktur Folder

```
Fullstack/
├── backend/
│   ├── src/
│   │   ├── config/         # Konfigurasi database (Sequelize: sqlite/mysql/postgres)
│   │   ├── controllers/    # Logic handler (auth, task)
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/         # Sequelize models (User, Task)
│   │   ├── routes/         # API routes + Swagger annotations
│   │   ├── validators/     # Input validation rules
│   │   └── app.js          # Express app entry point
│   ├── tests/              # Unit tests (Jest + Supertest)
│   ├── seed.js             # Script untuk generate data dummy
│   ├── swagger.js          # Swagger/OpenAPI config
│   ├── .env.example        # Template environment variables
│   ├── railway.json        # Konfigurasi deploy Railway
│   ├── DEPLOYMENT.md       # Panduan deploy backend (Railway)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page components (Login + Quick Login, Register, Dashboard)
│   │   ├── services/       # API service layer (Axios)
│   │   ├── App.jsx         # Root component + routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles + Tailwind
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── vercel.json         # Konfigurasi deploy Vercel (SPA rewrites)
│   ├── .env.example        # Template environment variables (VITE_API_URL)
│   ├── DEPLOYMENT.md       # Panduan deploy frontend (Vercel)
│   ├── Dockerfile
│   └── package.json
├── database/               # Schema & seed PostgreSQL untuk Supabase
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md           # Panduan setup Supabase
├── docker-compose.yml      # Docker orchestration
├── .gitignore
└── README.md
```

---

## 📝 Database Schema

### Users Table

| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| createdAt | DATETIME | Auto-generated |
| updatedAt | DATETIME | Auto-generated |

### Tasks Table

| Column | Type | Constraint |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| status | VARCHAR(20) | 'pending' / 'in-progress' / 'done' |
| deadline | DATE | NULLABLE |
| user_id | INT | FK → users.id, ON DELETE CASCADE |
| createdAt | DATETIME | Auto-generated |
| updatedAt | DATETIME | Auto-generated |

---

## ⚠️ Troubleshooting

### Backend tidak bisa connect ke MySQL
- Pastikan MySQL service sudah berjalan
- Cek credentials di file `.env` (DB_USER, DB_PASS)
- Pastikan database `kanggo_taskmanager` sudah dibuat

### Port sudah digunakan
- Backend default: port `5000` — ubah di `.env` (`PORT=5001`)
- Frontend default: port `5173` — Vite akan otomatis cari port lain

### CORS error di browser
- Pastikan `FRONTEND_URL` di `.env` backend sesuai dengan URL frontend
- Default: `http://localhost:5173`
