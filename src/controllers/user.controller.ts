import { Request, Response } from "express";
import { ISignup } from "../Types/Types";
import { signupValidator } from "../validators/auth.validator.js";
import UserModel from "../models/user.model";
import { BcryptMethods, generateToken } from "../utils/constant.js";
import { GroupModel } from "../models/group.model.js";

export const LoginController = async (req: Request, res: Response) => {
  // get email and password from user
  // find user by email to get hashed passowrd
  // compare hashed password with user given password
  // generate auth token and update token to user document
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Email and password are required",
      });
    }

    const findUserByEmail = await UserModel.findOne({ email });

    // if user not found
    if (!findUserByEmail) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // compare hashed password with plain passowrd
    if (findUserByEmail?.password) {
      const isPassowrdMatched = await BcryptMethods.compareHashAndPlainPassword(
        password,
        findUserByEmail?.password
      );
      if (!isPassowrdMatched) {
        return res.status(401).json({
          message: "Email or password doesn't matched",
        });
      }
    }

    const token = generateToken({ _id: findUserByEmail._id });

    if (!token) {
      return res.status(501).json({
        message: "Error while generate access token",
      });
    }

    // if everything fine then update token to database
    const user = await UserModel.findByIdAndUpdate(
      findUserByEmail._id,
      {
        $set: {
          token,
        },
      },
      { new: true }
    ).select("-password -__v");

    return res.status(200).json({
      message: "Login successfully",
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};

export const SignUpController = async (
  req: Request<{}, {}, ISignup>,
  res: Response
) => {
  /**
   * Strategy
   *  => get values from req.body
   *  => check whether user is already available or not if available then send response to user that go to login.
   *  => validate values using zod validator.
   *  => if values are correct then encrypt password using bcrypt
   *  => save values to databse
   *  => get id of user and then update the user by added jwt token
   *  => send response to user
   *  => add user to public group
   */
  const { email, name, password } = req.body;

  const { error, value } = signupValidator.validate({ email, name, password });
  if (error) {
    const errorMessages = error.details.map((err) => {
      return { field: err.context?.key, message: err.message };
    });
    return res.status(400).json(errorMessages);
  }

  const checkIsUserAlreadyExist = async (): Promise<boolean> => {
    try {
      const response = await UserModel.findOne({ email });
      if (response?.email && response?._id) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return true;
    }
  };

  const isUserExist = await checkIsUserAlreadyExist();

  if (isUserExist) {
    return res.status(400).json({
      message: "user already exist",
      statsCode: 400,
    });
  }

  const hashedPassword = await BcryptMethods.hashPassword(password);
  const createUserObject: any = {
    ...value,
    password: hashedPassword,
  };
  const saveUserToDatabase = await UserModel.create(createUserObject);
  const generateAuthenticationToken = generateToken({
    _id: saveUserToDatabase._id,
    email: saveUserToDatabase.email,
  });

  // update token to user document
  const updateTokenToUserDocument = await UserModel.findByIdAndUpdate(
    saveUserToDatabase._id,
    {
      token: generateAuthenticationToken,
    },
    {
      new: true,
    }
  ).select("-password -__v");

  //* adding user to public group
  await GroupModel.findOneAndUpdate(
    {
      groupKey: "group/public",
    },
    {
      $push: {
        members: updateTokenToUserDocument?._id,
      },
    }
  );

  return res.status(201).json({
    message: "signup successfull",
    statusCode: 201,
    data: updateTokenToUserDocument,
  });
};
