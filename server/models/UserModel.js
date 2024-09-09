import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isGoogle: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
});

export const User = mongoose.model("User", userSchema);

export default User;
