import mongoose from "mongoose";
import { io } from "../../app";
import { IMessage } from "../Types/Types";
import { GroupModel } from "../models/group.model";

io.on("connection", (socket) => {
  socket.on("message", async (message: IMessage) => {
    if (!message?.text?.trim()) {
      return io.emit("message-error", {
        message: "Message is required",
        statusCode: 400,
      });
    }
    if (!message?.groupId) {
      return io.emit("message-error", {
        message: "groupId is required",
        statusCode: 400,
      });
    }
    if (!message?.senderId) {
      return io.emit("message-error", {
        message: "senderId is required",
        statusCode: 400,
      });
    }
    const createMessageObject: IMessage = {
      text: message?.text,
      groupId: message?.groupId,
      senderId: message?.senderId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      _id: new mongoose.Types.ObjectId(),
    };

    const res = await GroupModel.findByIdAndUpdate(
      message?.groupId,
      {
        $push: { messages: createMessageObject },
      },
      {
        new: true,
      }
    );
    io.emit("message", res?.messages);
  });
});
