import { Router, Request, Response } from "express";
import { pool } from "../db.js";

const router = Router();

// Тіркелу (Register)
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, age, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Барлық өрістерді толтырыңыз" });
    }

    await pool.query(
      "INSERT INTO registered (name, email, age, password) VALUES ($1, $2, $3, $4)",
      [name, email, age || null, password]
    );

    return res.status(201).json({ message: "Пайдаланушы сәтті тіркелді" });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Бұл email тіркеліп қойған" });
    }
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Серверлік қателік" });
  }
});

// Киру (Login)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
    const result = await pool.query(
      "SELECT id, name, email FROM registered WHERE name = $1 AND password = $2",
      [name, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Аты немесе құпия сөз қате" });
    }

    return res.json({ message: "Сәтті кірдіңіз", user: result.rows[0] });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Серверлік қателік" });
  }
});

export default router;