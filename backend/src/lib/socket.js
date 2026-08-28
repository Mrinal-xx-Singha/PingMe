import express from "express";
import { Server } from "socket.io";
import http from "http";
import Group from "../models/group.model.js";

const app = express();
//we wrap the app and make it a server
// HTTP server for API routes

const server = http.createServer(app);

// Initializes a socket.io server on top of the HTTP server

const io = new Server(server, {
  cors: {
    // enable cors for frontend
    origin: ["http://localhost:5173"],
  },
});
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online user
//{userId:socketId}
const userSocketMap = {};

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  try {
    // Find all groups this user is a member of 
    const userGroups = await Group.find({ members: userId })
    userGroups.forEach(group => {
      socket.join(group._id.toString())
    })
  } catch (error) {
    console.error("Socket group join error:", error);
  }
  //   io.emit is used to send an event to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for 'typing ' event from the client
  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      // Forward the 'typing' event only to the specific  receiver 
      io.to(receiverSocketId).emit('userTyping', { senderId })
    }
  })
  // Listen to 'stopTyping' event from the client 
  socket.on('stopTyping', ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStoppedTyping', { senderId })
    }
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
