import mongoose from "mongoose";
import app from "./app";
const MONGO = process.env.MONGO_URI;

mongoose.connect(`${MONGO}`).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});
export default app;
