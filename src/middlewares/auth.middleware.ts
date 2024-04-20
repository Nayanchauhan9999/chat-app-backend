import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import UserModel from "../models/user.model";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access Token Not Provided",
      statusCode: 401,
    });
  }
  try {
    const extractDetailsFromToken = jwt.verify(token, process.env.SECRET_KEY);
    if (typeof extractDetailsFromToken !== "string") {
      const getUserById = await UserModel.findById(
        extractDetailsFromToken?._id
      );

      if (getUserById) {
        req.user = getUserById;
      }
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: error.message,
        statusCode: 401,
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong",
        statusCode: 500,
      });
    }
  }
  next();
};

export default authMiddleware;
