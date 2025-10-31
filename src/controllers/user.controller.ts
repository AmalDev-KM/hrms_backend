import { User } from "../models/user.model";
import { Request, Response } from "express";

//#region Approve User
export const approveUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.IsActive) {
      return res
        .status(400)
        .json({ success: false, message: "User already approved" });
    }

    user.IsActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        IsActive: user.IsActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};
//#endregion
