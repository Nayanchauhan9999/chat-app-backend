import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
