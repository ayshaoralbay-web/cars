import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  findUserById,
  createUser,
  createSession,
  findValidSession,
  getActiveSessions,
  revokeSession,
} from "../models/authModel";
import { AuthRequest } from "../middleware/authMiddleware";

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

async function issueSessionTokens(user: { id: number; email: string; role: string }, userAgent: string) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await createSession(user.id, hashToken(refreshToken), userAgent, expiresAt);

  return { session, accessToken, refreshToken };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ error: "Name, email, and password (min 6 chars) are required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (await findUserByEmail(cleanEmail)) {
      return res.status(409).json({ error: "This email is already registered." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name.trim(), cleanEmail, passwordHash);
    res.status(201).json({ message: "Registration successful! Please sign in.", user });
  } catch (e) { next(e); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });

    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const userAgent = req.headers["user-agent"] || "Web Browser";
    const tokens = await issueSessionTokens(user, userAgent);

    res.json({
      message: "Session started!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (e) { next(e); }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token missing." });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: number; email: string; role: string };
    const tokenHash = hashToken(refreshToken);
    if (!(await findValidSession(tokenHash))) {
      return res.status(401).json({ error: "Session expired or revoked." });
    }
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found." });

    await revokeSession(tokenHash);
    const userAgent = req.headers["user-agent"] || "Web Browser";
    res.json(await issueSessionTokens(user, userAgent));
  } catch {
    res.status(401).json({ error: "Invalid refresh token." });
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.refreshToken) await revokeSession(hashToken(req.body.refreshToken));
    res.json({ message: "Session closed. Logged out." });
  } catch (e) { next(e); }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await findUserById(req.user!.id);
    const sessions = await getActiveSessions(req.user!.id);
    res.json({ user, activeSessions: sessions });
  } catch (e) { next(e); }
}
