import { pool } from "../config/db";

export async function getAllCars(search = "", category = "", page = 1, limit = 6) {
  let where = "WHERE (title ILIKE $1 OR brand ILIKE $1)";
  const params: any[] = [`%${search}%`];
  if (category && category !== "All") {
    params.push(category);
    where += ` AND LOWER(category) = LOWER($${params.length})`;
  }
  const total = Number((await pool.query(`SELECT COUNT(*) FROM cars ${where}`, params)).rows[0].count);
  const pages = Math.ceil(total / limit) || 1;
  const dataRes = await pool.query(
    `SELECT * FROM cars ${where} ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, (page - 1) * limit]
  );
  return { items: dataRes.rows, total, page, pages };
}

export async function createNewCar(car: any) {
  const res = await pool.query(
    `INSERT INTO cars (title, brand, category, price, hp, acceleration, top_speed, engine_type, image_url, chassis_code, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [car.title, car.brand, car.category, car.price, car.hp, car.acceleration, car.top_speed, car.engine_type, car.image_url, car.chassis_code, car.description]
  );
  return res.rows[0];
}

export async function removeCarById(id: string) {
  const res = await pool.query("DELETE FROM cars WHERE id = $1 RETURNING id", [id]);
  return res.rows.length > 0;
}

export async function createTestDrive(data: any) {
  const res = await pool.query(
    "INSERT INTO test_drives (full_name, email, phone, location, car_id, preferred_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [data.full_name, data.email, data.phone, data.location || "Almaty", data.car_id, data.preferred_date]
  );
  return res.rows[0];
}

export async function getAllTestDrives() {
  const res = await pool.query("SELECT td.*, c.title AS car_title FROM test_drives td LEFT JOIN cars c ON td.car_id = c.id ORDER BY td.created_at DESC");
  return res.rows;
}
