import type { Types } from "mongoose";

export interface ISignup {
  email: string;
  name: string;
  password: string;
  token?: string;
}

export interface IUser {
  createdAt: Date;
  email: string;
  name: string;
  token: string;
  updatedAt: Date;
  _id: string;
  password?: string;
}

export interface IMessage {
  _id?: Types.ObjectId;
  text: string;
  senderId: Types.ObjectId;
  groupId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
