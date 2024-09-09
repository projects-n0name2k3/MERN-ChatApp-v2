import { Server as SocketIOServer } from "socket.io";
import Message from "../models/MessageModel.js";
import Channel from "../models/ChannelModel.js";

const userSocketMap = new Map();

export const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const disconnect = (socket) => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys())); // Emit to all connected clients
        console.log(`${userId} disconnected from ${socket.id}`);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const receiverSocketId = userSocketMap.get(message.receiver);
    if (senderSocketId === receiverSocketId) {
      return;
    }
    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id username email image")
      .populate("receiver", "id username email image");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, file } = message;
    console.log(message);
    const createMessage = await Message.create({
      sender,
      content,
      messageType,
      file,
      receiver: null,
      timestamps: new Date(),
    });

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id username email image")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const membersSocketId = userSocketMap.get(member._id.toString());
        if (membersSocketId) {
          io.to(membersSocketId).emit("receiveChannelMessage", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receiveChannelMessage", finalData);
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`${userId} connected to ${socket.id}`);
    } else {
      console.log("No user connected");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    socket.on("disconnect", () => disconnect(socket));
  });
};
