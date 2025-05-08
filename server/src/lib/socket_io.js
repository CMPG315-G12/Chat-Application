import { Server } from "socket.io"
import http from "http"
import express from "express"


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from your frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
        credentials: true, // Allow cookies and credentials
    },
});

//Stores online users and their socket ids
// This is a simple in-memory store. In a production app, you might want to use a more robust solution like Redis.
const userSocketMap = {}; //{userId: socket.id}

const getRecieverSocketId = (id) => {
    return userSocketMap[id]; // Retrieve the socket id for the user
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId; // Assuming userId is sent in the handshake auth
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the socket id for the user
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap)); // Notify all clients about the new user

    socket.on("disconnect", () => {
        delete userSocketMap[userId]; // Remove the user from the map
        io.emit("getOnlineUser", Object.keys(userSocketMap)); // Notify all clients about the user leaving
    });

    socket.on("join-room", (roomName) => {
        socket.join(roomName); // Join the specified room
    });

    socket.on("leave-room", (roomName) => {
        socket.leave(roomName); // Leave the specified room
    });
    
});

export { io, server, app, getRecieverSocketId };