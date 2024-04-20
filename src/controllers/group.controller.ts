import { Request, Response } from "express";
import { GroupModel } from "../models/group.model.js";

export const getUserGroupList = async (req: Request, res: Response) => {
  try {
    const groupList = await GroupModel.find({
      members: {
        $in: [req.user?._id],
      },
    }).select("-messages -members");

    return res.status(200).json({
      message: "groups fetched successfully",
      statusCode: 200,
      data: groupList,
    });
  } catch (error) {}
};

export const getGroupMessagesByGroupId = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("id", req.query);

    if (!req.query?.groupId) {
      return res.status(400).json({
        message: "Group id is required",
        statusCode: 400,
      });
    }
    const messages = await GroupModel.findById(req.query?.groupId);

    return res.status(200).json({
      message: "groups fetch successfully",
      statusCode: 200,
      data: messages,
    });
  } catch (error) {}
};
