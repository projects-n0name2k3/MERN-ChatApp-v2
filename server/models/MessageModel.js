import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messageType: {
    type: String,
    required: true,
    enum: ["text", "file"],
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  file: {
    type: [String],
    required: function () {
      return this.messageType === "file";
    },
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
