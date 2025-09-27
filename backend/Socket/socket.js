
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',  // Frontend URL
        methods: ['GET', 'POST'],  // Allowed methods
        credentials: true,  // Allow credentials if necessary
    }
});

const userSocketMap = {}; // userId: socketId

// Function to get the socket ID of a receiver
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const getSenderSocketId = (senderId) => {
    return userSocketMap[senderId];
};

// Listening for connections
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;

    // Validate userId (e.g., check if valid and authenticated)
    if (userId && userId !== 'undefined') {
        // Map userId to socketId
        userSocketMap[userId] = socket.id;
        // Emit online users list to all clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    } else {
        // If userId is invalid, disconnect the socket
        socket.disconnect();
    }

    // Handle incoming messages (if you want to listen for events)
    socket.on('newMessage', (message) => {
        console.log('New message received:', message);
        // Handle message broadcasting here if necessary
    });

    // Listening for disconnections
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);

        // Find and remove the disconnected user from userSocketMap
        for (const [id, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[id];
                break;
            }
        }

        // Emit updated online users list to all clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// Export the app, io, and server for use elsewhere in your application
module.exports = { app, io, server, getReceiverSocketId, getSenderSocketId };
