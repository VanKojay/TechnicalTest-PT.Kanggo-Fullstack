const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Supported dialects: 'sqlite' (local dev), 'mysql', 'postgres' (e.g. Supabase)
const dialect = process.env.DB_DIALECT || 'mysql';

if (dialect === 'sqlite') {
  const storagePath = process.env.DB_STORAGE || path.join(__dirname, '..', '..', 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
  });
} else if (process.env.DATABASE_URL) {
  // Connection-string mode — used by Supabase / Railway / most managed Postgres.
  // SSL is required by Supabase; rejectUnauthorized=false works with their pooler cert.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect,
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
    dialectOptions:
      dialect === 'postgres'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  // Discrete host/user/pass config (MySQL or self-hosted Postgres)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || (dialect === 'postgres' ? 5432 : 3306),
      dialect,
      logging: process.env.NODE_ENV === 'test' ? false : console.log,
      dialectOptions:
        dialect === 'postgres'
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : {},
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;
