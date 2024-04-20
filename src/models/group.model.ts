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
    messages: [
      {
        text: String,
        groupId: String,
        senderId: String,
        createdAt: {
          type: Date,
          default: new Date(Date.now()),
        },
        updatedAt: {
          type: Date,
          default: new Date(Date.now()),
        },
        _id: mongoose.Schema.ObjectId,
      },
    ],
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
