import { Router } from "express";
import { getCars, addCar, deleteCar, bookTestDrive, getTestDrives } from "../controllers/carController";
import { authenticateToken, allowRoles } from "../middleware/authMiddleware";

const router = Router();
router.get("/cars", getCars);
router.post("/test-drive", authenticateToken, allowRoles("user", "admin"), bookTestDrive);
router.post("/cars", authenticateToken, allowRoles("admin"), addCar);
router.delete("/cars/:id", authenticateToken, allowRoles("admin"), deleteCar);
router.get("/test-drive", authenticateToken, allowRoles("admin"), getTestDrives);
export default router;
