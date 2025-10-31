import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import mongoose from "mongoose";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

//#region  Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        saveStatus: false,
        message: "Requires parameters are not served",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ saveStatus: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ saveStatus: true, message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
//#endregion

//#region Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        saveStatus: false,
        message: "Email id and apssword are not provided",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ saveStatus: false, message: "No user found" });
    }

    if (existingUser.IsDeleted) {
      return res
        .status(403)
        .json({ saveStatus: false, message: "User account is deleted" });
    }

    if (!existingUser.IsActive) {
      return res
        .status(403)
        .json({ saveStatus: false, message: "User account is not active" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        saveStatus: false,
        message: "Invalid credentials",
      });
    }

    const token = await generateToken(
      (existingUser._id as mongoose.Types.ObjectId).toString(),
      "7d"
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      saveStatus: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
//#endregion

//#region  Logout User
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
//#endregion
