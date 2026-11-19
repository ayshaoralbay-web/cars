import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: "admin" | "user" };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token жоқ. Алдымен жүйеге кіріңіз." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; role: "admin" | "user" };
    next();
  } catch {
    return res.status(401).json({ error: "Access token жарамсыз немесе уақыты біткен." });
  }
}

export function allowRoles(...allowedRoles: Array<"admin" | "user">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Рұқсат жоқ! Тек [${allowedRoles.join(", ")}] рөліне рұқсат.` });
    }
    next();
  };
}
