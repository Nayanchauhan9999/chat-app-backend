import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { connectToDatabase } from "./src/utils/dbConnection";
import dotenv from "dotenv";

// .env configruration
dotenv.config({
  path: "./.env.development",
});

// database connection
connectToDatabase();

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
app.use(cors());
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// handling message
import "./src/socket/chat.socket.js";

app.get("/", (req, res) => {
  res.json({
    message: "welcome",
  });
});

server.listen(PORT, () => {
  console.log("Server Running At http://localhost:" + PORT);
});
