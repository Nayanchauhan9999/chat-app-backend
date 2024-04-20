import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    isIndividualChat: {
      type: Boolean,
      default: false,
    },
    members: {
      type: [mongoose.Schema.ObjectId],
      ref: "user",
    },
    messages: {
      type: [mongoose.Schema.ObjectId],
      ref: "message",
    },
    groupKey: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GroupModel = mongoose.model("group", groupSchema);
