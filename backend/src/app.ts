import express, { Request, Response } from "express";
import mongoose from "mongoose";
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

const MONGO = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose.connect(`${MONGO}`).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => {
    console.error("MongoDB connection error:", err);
});
