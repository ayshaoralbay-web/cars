import { Router, Request, Response } from "express";
import { pool } from "../db.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone, location, car_id, preferred_date } = req.body;

    if (!full_name || !email || !phone || !car_id || !preferred_date) {
      return res.status(400).json({ message: "Міндетті өрістерді толтырыңыз" });
    }

    const result = await pool.query(
      `INSERT INTO test_drives (full_name, email, phone, location, car_id, preferred_date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [full_name, email, phone, location || "Monaco", car_id, preferred_date]
    );

    return res.status(201).json({
      message: "Тест-драйв сәтті броньдалды! Консьерж сізбен хабарласады.",
      bookingId: result.rows[0].id,
    });
  } catch (error) {
    console.error("TestDrive Booking Error:", error);
    return res.status(500).json({ message: "Броньдау барысында қате шықты" });
  }
});

export default router;