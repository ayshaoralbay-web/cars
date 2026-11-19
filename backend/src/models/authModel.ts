import { pool } from "../config/db";

export async function findUserByEmail(email: string) {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] || null;
}

export async function findUserById(id: number) {
  const res = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return res.rows[0] || null;
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const res = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role",
    [name, email, passwordHash]
  );
  return res.rows[0];
}

export async function createSession(userId: number, tokenHash: string, userAgent: string, expiresAt: Date) {
  await pool.query("ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT 'Browser'").catch(() => {});
  const res = await pool.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, user_agent, expires_at) VALUES ($1, $2, $3, $4) RETURNING id, user_agent, created_at, expires_at",
    [userId, tokenHash, userAgent, expiresAt]
  );
  return res.rows[0];
}

export async function findValidSession(tokenHash: string) {
  const res = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()",
    [tokenHash]
  );
  return res.rows[0] || null;
}

export async function getActiveSessions(userId: number) {
  const res = await pool.query(
    "SELECT id, user_agent, created_at, expires_at FROM refresh_tokens WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW() ORDER BY id DESC",
    [userId]
  );
  return res.rows;
}

export async function revokeSession(tokenHash: string) {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL",
    [tokenHash]
  );
}
