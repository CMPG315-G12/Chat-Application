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
const typingUsers = {}; // Track users who are currently typing

const getRecieverSocketId = (id) => {
    return userSocketMap[id]; // Retrieve the socket id for the user
}

io.on("connection", (socket) => {
    try {
        const userId = socket.handshake.query.userId; // Assuming userId is sent in the handshake auth
        if (userId) {
            userSocketMap[userId] = socket.id; // Store the socket id for the user
            console.log(`User connected: ${userId}, socket ID: ${socket.id}`);
        } else {
            console.log("User connected without userId");
        }

        io.emit("getOnlineUser", Object.keys(userSocketMap)); // Notify all clients about the new user

        socket.on("disconnect", () => {
            if (userId) {
                console.log(`User disconnected: ${userId}`);
                delete userSocketMap[userId]; // Remove the user from the map
                
                // Clear typing status when user disconnects
                for (const room in typingUsers) {
                    if (typingUsers[room] && typingUsers[room][userId]) {
                        delete typingUsers[room][userId];
                        io.to(room).emit("typing", { room, users: Object.keys(typingUsers[room] || {}) });
                    }
                }
                
                io.emit("getOnlineUser", Object.keys(userSocketMap)); // Notify all clients about the user leaving
            }
        });

        socket.on("join-room", (roomName) => {
            try {
                if (!roomName) {
                    console.error("Invalid room name received");
                    return;
                }
                socket.join(roomName); // Join the specified room
                console.log(`User ${userId} joined room: ${roomName}`);
                
                // Initialize typing users for this room if needed
                if (!typingUsers[roomName]) {
                    typingUsers[roomName] = {};
                }
            } catch (error) {
                console.error(`Error joining room: ${error.message}`);
            }
        });

        socket.on("leave-room", (roomName) => {
            try {
                if (!roomName) {
                    console.error("Invalid room name received");
                    return;
                }
                socket.leave(roomName); // Leave the specified room
                console.log(`User ${userId} left room: ${roomName}`);
                
                // Remove user's typing status from the room
                if (typingUsers[roomName] && typingUsers[roomName][userId]) {
                    delete typingUsers[roomName][userId];
                    io.to(roomName).emit("typing", { room: roomName, users: Object.keys(typingUsers[roomName] || {}) });
                }
            } catch (error) {
                console.error(`Error leaving room: ${error.message}`);
            }
        });
        
        // Handle typing indicators for direct messages
        socket.on("typing:start:user", ({ recipientId }) => {
            if (!userId || !recipientId) return;
            
            const recipientSocketId = userSocketMap[recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("typing:user", { userId, isTyping: true });
            }
        });
        
        socket.on("typing:stop:user", ({ recipientId }) => {
            if (!userId || !recipientId) return;
            
            const recipientSocketId = userSocketMap[recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("typing:user", { userId, isTyping: false });
            }
        });
        
        // Handle typing indicators for group chats
        socket.on("typing:start:group", ({ groupId }) => {
            if (!userId || !groupId) return;
            
            // Get the room name (in this case, the group's unique code)
            const group = typingUsers[groupId] || (typingUsers[groupId] = {});
            group[userId] = true;
            
            // Broadcast to everyone in the room
            socket.to(groupId).emit("typing:group", { 
                groupId, 
                users: Object.keys(group)
            });
        });
        
        socket.on("typing:stop:group", ({ groupId }) => {
            if (!userId || !groupId) return;
            
            const group = typingUsers[groupId];
            if (group && group[userId]) {
                delete group[userId];
                
                // Broadcast to everyone in the room
                socket.to(groupId).emit("typing:group", { 
                    groupId, 
                    users: Object.keys(group)
                });
            }
        });
        
        socket.on("error", (error) => {
            console.error(`Socket error for user ${userId}: ${error.message}`);
        });
    } catch (error) {
        console.error(`Error handling socket connection: ${error.message}`);
    }
});

export { io, server, app, getRecieverSocketId };