import express from "express";
import {
  getUserGroupList,
  getGroupMessagesByGroupId,
  sendMessage,
} from "../controllers/group.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/group-list", authMiddleware, getUserGroupList);
router.get("/group-messages", authMiddleware, getGroupMessagesByGroupId);
router.post("/send-message", authMiddleware, sendMessage);

export default router;
