// src/middlewares/role.middleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user as any;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

export const isHR = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user as any;

  if (!user || user.role !== "hr") {
    return res.status(403).json({ message: "Access denied. HR only." });
  }

  next();
};

export const isManager = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user as any;

  if (!user || user.role !== "manager") {
    return res.status(403).json({ message: "Access denied. Managers only." });
  }

  next();
};
