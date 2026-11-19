import { Router } from "express";
import { register, login, refresh, logout, getProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticateToken, getProfile);
export default router;
