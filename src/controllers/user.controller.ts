import { Request, Response } from "express";
import { ISignup } from "../Types/Types";
import { signupValidator } from "../validators/auth.validator";
import UserModel from "../models/user.model";
import { BcryptMethods, generateToken } from "../utils/constant";

export const LoginController = () => {};

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
  );

  return res.status(201).json({
    message: "signup successfull",
    statusCode: 201,
    data: updateTokenToUserDocument,
  });
};
