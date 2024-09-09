import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please login first", success: false });
    }
    const admin = await User.findById(userId);
    if (!admin) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res
        .status(404)
        .json({ message: "Some members not found", success: false });
    }

    const newChannel = new Channel({
      name,
      admin: userId,
      members,
    });
    await newChannel.save();
    res
      .status(201)
      .json({ message: "Channel created", success: true, data: newChannel });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please login first", success: false });
    }
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({
      updatedAt: -1,
    });

    res
      .status(200)
      .json({ message: "Channels fetched", success: true, data: channels });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "username email image _id",
      },
    });
    if (!channel) {
      return res
        .status(404)
        .json({ message: "Channel not found", success: false });
    }
    res.status(200).json({
      message: "Messages fetched",
      success: true,
      data: channel.messages,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
