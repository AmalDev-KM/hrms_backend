import { User } from "../models/user.model";
import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = async (id: string, expiresIn: string = "30d"): Promise<string> => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found for token generation");
  }

  const payload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};
