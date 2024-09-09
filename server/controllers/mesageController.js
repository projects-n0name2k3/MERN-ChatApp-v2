import mongoose from "mongoose";
import Message from "../models/MessageModel.js";

export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    if (!user1 || !user2) {
      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamps: 1 });
    res.status(200).json({ data: messages, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getContactsFromDMList = async (req, res) => {
  try {
    let userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }
    userId = new mongoose.Types.ObjectId(userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamps: -1 }, // Corrected to use $sort
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamps" },
          lastMessageContent: { $first: "$content" },
          lastMessageType: { $first: "$messageType" },
          lastMessageSent: { $first: "$sender" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          username: "$contactInfo.username",
          email: "$contactInfo.email",
          image: "$contactInfo.image",
          lastMessageTime: 1,
          lastMessageContent: 1,
          lastMessageType: 1,
          lastMessageSent: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    res.status(200).json({ data: contacts, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
