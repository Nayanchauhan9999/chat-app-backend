import express from "express";
import {
  LoginController,
  SignUpController,
} from "../controllers/user.controller.js";

const route = express.Router();

route.post("/login", LoginController);
route.post("/signup", SignUpController);

export default route;
