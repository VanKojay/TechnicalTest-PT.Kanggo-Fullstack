require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Task } = require('./src/models');

const dummyUsers = [
  { name: 'Budi Santoso', email: 'budi@kanggo.com', password: 'password123' },
  { name: 'Siti Rahayu', email: 'siti@kanggo.com', password: 'password123' },
];

const dummyTasks = [
  // Budi's tasks (userId: 1)
  { title: 'Setup project repository', description: 'Inisialisasi repo GitHub dan setup branch strategy (main, develop, feature).', status: 'done', deadline: '2026-06-20', userId: 1 },
  { title: 'Design database schema', description: 'Buat ERD dan tentukan relasi antar tabel untuk sistem task management.', status: 'done', deadline: '2026-06-21', userId: 1 },
  { title: 'Implementasi REST API backend', description: 'Develop endpoint CRUD tasks dan autentikasi menggunakan Express.js dan JWT.', status: 'done', deadline: '2026-06-23', userId: 1 },
  { title: 'Buat halaman login & register', description: 'Frontend form dengan validasi dan integrasi ke API auth.', status: 'in-progress', deadline: '2026-06-25', userId: 1 },
  { title: 'Develop dashboard tugas', description: 'Halaman utama menampilkan list tugas dengan filter status dan live search.', status: 'in-progress', deadline: '2026-06-26', userId: 1 },
  { title: 'Integrasi frontend dengan backend', description: 'Koneksi semua komponen React ke REST API menggunakan Axios.', status: 'pending', deadline: '2026-06-27', userId: 1 },
  { title: 'Unit testing backend', description: 'Tulis minimal 5 test case untuk endpoint auth dan tasks menggunakan Jest.', status: 'pending', deadline: '2026-06-28', userId: 1 },
  { title: 'Setup Docker & docker-compose', description: 'Containerize aplikasi backend, frontend, dan MySQL database.', status: 'pending', deadline: '2026-06-29', userId: 1 },
  { title: 'Buat dokumentasi API (Swagger)', description: 'Dokumentasikan semua endpoint di Swagger UI agar mudah diuji.', status: 'pending', deadline: '2026-06-30', userId: 1 },
  { title: 'Rekam video demo aplikasi', description: 'Record demo max 15 menit, upload ke YouTube (unlisted) untuk submission.', status: 'pending', deadline: '2026-07-01', userId: 1 },
  { title: 'Review & refactor kode', description: 'Code review, clean up unused imports, tambah komentar pada logic kompleks.', status: 'pending', deadline: '2026-07-01', userId: 1 },
  { title: 'Deploy ke Vercel + Railway', description: 'Deploy frontend ke Vercel dan backend ke Railway untuk demo online.', status: 'pending', deadline: null, userId: 1 },

  // Siti's tasks (userId: 2)
  { title: 'Riset UI/UX best practices', description: 'Kumpulkan referensi desain modern untuk task management app.', status: 'done', deadline: '2026-06-19', userId: 2 },
  { title: 'Wireframe halaman utama', description: 'Sketch layout dashboard, task card, dan navigation flow.', status: 'done', deadline: '2026-06-20', userId: 2 },
  { title: 'Implementasi responsive design', description: 'Pastikan semua halaman responsive di mobile (375px) dan desktop.', status: 'in-progress', deadline: '2026-06-25', userId: 2 },
  { title: 'Testing cross-browser', description: 'Test di Chrome, Firefox, dan Edge. Catat bug yang ditemukan.', status: 'pending', deadline: '2026-06-28', userId: 2 },
  { title: 'Optimasi performa frontend', description: 'Lazy loading, code splitting, dan minifikasi assets.', status: 'pending', deadline: '2026-06-30', userId: 2 },
  { title: 'Tulis README.md lengkap', description: 'Dokumentasi setup, fitur, screenshot, dan cara menjalankan aplikasi.', status: 'pending', deadline: null, userId: 2 },
];

async function seed() {
  try {
    // Force sync = drop & recreate all tables
    await sequelize.sync({ force: true });
    console.log('🗑️  Database cleared & tables recreated');

    // Create users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    for (const u of dummyUsers) {
      const hashed = await bcrypt.hash(u.password, salt);
      await User.create({ name: u.name, email: u.email, password: hashed });
    }
    console.log(`👤 Created ${dummyUsers.length} users`);

    // Create tasks
    for (const t of dummyTasks) {
      await Task.create(t);
    }
    console.log(`📋 Created ${dummyTasks.length} tasks`);

    // Summary
    const userCount = await User.count();
    const taskCount = await Task.count();
    console.log(`\n✅ Seeding complete!`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Tasks: ${taskCount}`);
    console.log(`\n📌 Login credentials:`);
    console.log(`   Email: budi@kanggo.com  |  Password: password123  (12 tasks)`);
    console.log(`   Email: siti@kanggo.com  |  Password: password123  (6 tasks)`);

    await sequelize.close();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
