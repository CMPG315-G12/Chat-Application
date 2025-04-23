import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

dotenv.config();
const PORT = process.env.PORT;


app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    connectDB();
}) 