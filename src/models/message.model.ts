import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    groupId: {
      type: mongoose.Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModal = mongoose.model("message", messageSchema);

export default MessageModal;
