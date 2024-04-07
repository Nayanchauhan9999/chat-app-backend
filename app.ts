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
app.use(express.json());
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// handling message
import "./src/socket/chat.socket.js";
import { AuthRoutes } from "./src/routes";

app.get("/", (req, res) => {
  res.json({
    message: "welcome",
  });
});

app.use("/auth", AuthRoutes);

server.listen(PORT, () => {
  console.log("Server Running At http://localhost:" + PORT);
});
