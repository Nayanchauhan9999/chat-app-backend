import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GroupModel } from "../models/group.model.js";
import { Types } from "mongoose";
import UserModel from "../models/user.model.js";

export const generateToken = (arg: Record<string, any>): string => {
  const createToken = jwt.sign(arg, process.env.SECRET_KEY);
  return createToken;
};

export class BcryptMethods {
  static async hashPassword(
    plainPassword: string
  ): Promise<string | undefined> {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      return hashedPassword;
    } catch (error) {
      console.log("error occoured while hashing the password", error);
    }
  }

  static async compareHashAndPlainPassword(
    plainPassword: string,
    encryptedPassword: string
  ): Promise<boolean | undefined> {
    try {
      const comparePasswords = await bcrypt.compare(
        plainPassword,
        encryptedPassword
      );
      return comparePasswords;
    } catch (error) {
      console.log("error while comparing the passwords", error);
    }
  }
}

// export const hashPassword = async (plainPassword: string) => {
//   try {
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);
//     return hashedPassword;
//   } catch (error) {
//     console.log("error occoured while hashing the password", error);
//   }
// };

export const compareHashAndPlainPassword = async () => {};

export const createPublicGroup = async () => {
  try {
    const groupName = "public group";
    const groupKey = "group/public";
    const groupId = "6623cd8604658336813e87ed";

    const checkGroupAlreadyExist = await GroupModel.findOne({
      groupKey,
    });

    if (checkGroupAlreadyExist?.groupKey) {
      return;
    }

    const getAllUsers = await UserModel.find({});
    await GroupModel.create({
      name: groupName,
      groupKey: groupKey,
      members: getAllUsers,
      //! do not change the mongo id
      _id: new Types.ObjectId(groupId),
    });
  } catch (error) {
    console.log("error while creating public group", error);
  }
};
