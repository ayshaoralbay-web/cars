import bcrypt from "bcryptjs";
import { pool } from "../config/db";
import { initialCars } from "./data/carsData";

export async function createTablesAndSeed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      revoked_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cars (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      brand VARCHAR(60) NOT NULL,
      category VARCHAR(60) NOT NULL,
      price NUMERIC(12, 2) NOT NULL,
      hp INT NOT NULL,
      acceleration NUMERIC(3, 1) NOT NULL,
      top_speed INT NOT NULL,
      engine_type VARCHAR(60) NOT NULL,
      image_url TEXT NOT NULL,
      chassis_code VARCHAR(40) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS test_drives (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      location VARCHAR(100) NOT NULL,
      car_id INT REFERENCES cars(id) ON DELETE CASCADE,
      preferred_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const countRes = await pool.query("SELECT COUNT(*) FROM cars");
  if (Number(countRes.rows[0].count) === 0) {
    for (const c of initialCars) {
      await pool.query(
        `INSERT INTO cars (title, brand, category, price, hp, acceleration, top_speed, engine_type, image_url, chassis_code, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [c.title, c.brand, c.category, c.price, c.hp, c.acceleration, c.top_speed, c.engine_type, c.image_url, c.chassis_code, c.description]
      );
    }
  }

  const adminHash = await bcrypt.hash("Admin12345", 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Super Admin', 'admin@auramotors.com', $1, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [adminHash]
  );
}
