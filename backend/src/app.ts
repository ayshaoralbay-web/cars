import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import carRoutes from "./routes/carRoutes";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", carRoutes);
app.get("/", (_req, res) => res.json({ status: "OK", message: "Cars MVC API" }));
app.use(notFoundHandler);
app.use(globalErrorHandler);
export default app;
