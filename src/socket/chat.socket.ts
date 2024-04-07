import { io } from "../../app";
import MessageModal from "../models/message.model.js";

io.on("connection", (socket) => {
  socket.on("message", async (message) => {
    io.emit("message", message);
    await MessageModal.create({ message });
  });
});
