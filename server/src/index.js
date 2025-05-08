import express from "express";
//Init .env
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./lib/lib.passport.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import {app, server} from "./lib/socket_io.js";
import fs from "fs";

const PORT = process.env.PORT || 5000;

// Get directory names as __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, "../public/uploads");
const avatarsDir = path.join(uploadsDir, "avatars");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

// --Middleware --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "*", // Allow requests from your frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
        credentials: true, // Allow cookies and credentials
        allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    })
);
app.use(cookieParser()); // JWT cookie parsing
app.use(passport.initialize());

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// -- Database --
connectDB();

// -- Routes --
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Test - Your API endpoints here
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
