import mongoose from "mongoose";
import { ISignup } from "../Types/Types";

const userSchema = new mongoose.Schema<ISignup>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
