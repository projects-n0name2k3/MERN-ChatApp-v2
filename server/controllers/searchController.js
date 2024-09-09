import User from "../models/UserModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please login first", success: false });
    }
    const users = await User.find({ _id: { $ne: userId } }).select(
      "username email image _id"
    );

    const contacts = users.map((user) => ({
      label: user.username + " ( " + user.email + " )",
      value: user._id,
    }));
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const searchUserByEmailOrUsername = async (req, res) => {
  try {
    const { search } = req.params;
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please login first", success: false });
    }
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        { _id: { $ne: userId } },
      ],
    });

    const usersData = users.map((user) => {
      const { _id, email, username, image } = user;
      return { _id, email, username, image };
    });
    res.status(200).json({
      success: true,
      data: usersData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
