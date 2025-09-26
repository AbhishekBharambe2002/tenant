import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import tenantRoutes from "./routes/tenantRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/health", (req: Request, res: Response) => res.json({ status: "ok" }));

app.use("/api", authRoutes);
app.use("/api", noteRoutes);
app.use("/api", tenantRoutes);


export default app;