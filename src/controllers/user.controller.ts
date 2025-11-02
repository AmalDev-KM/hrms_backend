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

//#region View all Users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const role = (req.query.role as string) || "";
    const isActive = req.query.isActive ? req.query.isActive === "true" : undefined;

    // Build filters dynamically
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    if (role) filter.role = role;
    if (isActive !== undefined) filter.IsActive = isActive;

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch users and total count
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      saveStatus: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      count: users.length,
      users,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ saveStatus: false, message: err.message });
    } else {
      res.status(500).json({ saveStatus: false, message: "Unknown server error" });
    }
  }
};
//#endregion

//#region Deactivate User
export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      id,
      { IsActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({
        saveStatus: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      saveStatus: true,
      message: "User deactivated successfully",
      user,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        saveStatus: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        saveStatus: false,
        message: "Unknown server error",
      });
    }
  }
};
//#endregion