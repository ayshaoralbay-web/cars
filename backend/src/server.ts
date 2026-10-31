import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import carRoutes from "./routes/cars";
import testDriverRoutes from "./routes/testdrive";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/test-drive", testDriveRoutes);


app.get("/", (req, res) => {
  res.send({ status: "OK", system: "AURA Hypercars REST API Active" });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
