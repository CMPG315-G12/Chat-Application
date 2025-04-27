import express from "express";
//Init .env
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./lib/lib.passport.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";



const app = express();
const PORT = process.env.PORT;

// --Middleware --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*', // Adjust based on your security requirements
    credentials: true
}));
app.use(cookieParser()); // JWT cookie parsing
app.use(passport.initialize());

// -- Database --
connectDB();

// -- Routes --
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Test - Your API endpoints here
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`)); 
