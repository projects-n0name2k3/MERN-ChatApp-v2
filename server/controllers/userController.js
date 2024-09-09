import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../helpers/validate.js";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";

export const updateInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, image } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ message: "Please login first" });
    }

    if (decoded.id !== id) {
      return res.status(400).json({
        message: "You are not authorized to update this user",
        success: false,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser && existedUser.email !== user.email) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    if (user.username === username) {
      return res
        .status(400)
        .json({ message: "Please enter new username", success: false });
    }
    if (user.email === email) {
      return res
        .status(400)
        .json({ message: "Please enter new email", success: false });
    }

    if (username) {
      if (validateUsername(username) !== true) {
        return res
          .status(400)
          .json({ message: validateUsername(username), success: false });
      }
      user.username = username;
    }

    if (email) {
      if (validateEmail(email) !== true) {
        return res
          .status(400)
          .json({ message: validateEmail(email), success: false });
      }
      user.email = email;
    }
    if (image) {
      user.image = image;
    }

    await user.save();
    const data = {
      username: user.username,
      email: user.email,
      image: user.image,
      id: user._id,
    };
    res
      .status(200)
      .json({ message: "User updated successfully", success: true, data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ message: "Please login first" });
    }

    if (decoded.id !== id) {
      return res.status(400).json({
        message: "You are not authorized to update this user",
        success: false,
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "Please enter new password", success: false });
    }
    const validPassword = bcryptjs.compareSync(oldPassword, user.password);
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Wrong current password" });
    }
    if (validatePassword(newPassword) !== true) {
      return res
        .status(400)
        .json({ message: validatePassword(newPassword), success: false });
    }
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    const data = {
      username: user.username,
      email: user.email,
      image: user.image,
      id: user._id,
    };
    res
      .status(200)
      .json({ message: "Password updated successfully", success: true, data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const test = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
