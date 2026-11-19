import { Request, Response, NextFunction } from "express";
import { getAllCars, createNewCar, removeCarById, createTestDrive, getAllTestDrives } from "../models/carModel";

export async function getCars(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getAllCars(String(req.query.search || ""), String(req.query.category || ""), Number(req.query.page) || 1, Number(req.query.limit) || 6));
  } catch (e) { next(e); }
}

export async function addCar(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, brand, category, price, hp, acceleration, top_speed, engine_type, image_url, chassis_code, description } = req.body;
    if (!title || !price || !image_url) return res.status(400).json({ error: "Title, price және image_url міндетті." });
    const newCar = await createNewCar({
      title, brand: brand || "Apex", category: category || "Hypercar", price: Number(price),
      hp: Number(hp) || 1000, acceleration: Number(acceleration) || 2.5, top_speed: Number(top_speed) || 350,
      engine_type: engine_type || "V12 Twin-Turbo", image_url,
      chassis_code: chassis_code || `CH-${Math.floor(1000 + Math.random() * 9000)}`,
      description: description || "Bespoke luxury hypercar."
    });
    res.status(201).json({ message: "Жаңа көлік қосылды!", car: newCar });
  } catch (e) { next(e); }
}

export async function deleteCar(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(await removeCarById(String(req.params.id)))) return res.status(404).json({ error: "Көлік табылмады." });
    res.json({ message: "Көлік өшірілді." });
  } catch (e) { next(e); }
}

export async function bookTestDrive(req: Request, res: Response, next: NextFunction) {
  try {
    const { full_name, email, phone, location, car_id, preferred_date } = req.body;
    if (!full_name || !email || !phone || !car_id || !preferred_date) return res.status(400).json({ error: "Барлық өрістерді толтырыңыз." });
    const booking = await createTestDrive({ full_name, email, phone, location, car_id: Number(car_id), preferred_date });
    res.status(201).json({ message: "Test Drive өтінімі қабылданды!", booking });
  } catch (e) { next(e); }
}

export async function getTestDrives(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await getAllTestDrives()); } catch (e) { next(e); }
}
