import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", noteRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
