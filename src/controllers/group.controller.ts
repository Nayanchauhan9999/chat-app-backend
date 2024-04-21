import { Request, Response } from "express";
import { GroupModel } from "../models/group.model.js";
import { createPublicGroup } from "../utils/constant.js";
// import { IMessage } from "../Types/Types.js";

export const getUserGroupList = async (req: Request, res: Response) => {
  try {
    const groupsCount = await GroupModel.find({}).countDocuments();

    console.log("group count", groupsCount);

    if (groupsCount === 0) {
      await createPublicGroup();
    }

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

// export const sendMessage = async (
//   req: Request<any, any, IMessage>,
//   res: Response
// ) => {
//   try {
//     const { text, groupId, senderId } = req.body;

//     if (!text?.trim()) {
//       return res.status(400).json({
//         message: "Message is required",
//         statusCode: 400,
//       });
//     }
//     if (!groupId) {
//       return res.status(400).json({
//         message: "groupId required",
//         statusCode: 400,
//       });
//     }
//     if (!senderId) {
//       return res.status(400).json({
//         message: "senderId required",
//         statusCode: 400,
//       });
//     }

//     // now we have group id, sender id and message

//     const createMessageObject: IMessage = {
//       text,
//       groupId,
//       senderId,
//       createdAt: new Date(Date.now()),
//       updatedAt: new Date(Date.now()),

//     };
//     return res.status(200).json({
//       message: "Send Message successfully",
//       statusCode: 200,
//       data: null,
//     });
//   } catch (error) {}
// };
