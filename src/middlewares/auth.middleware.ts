import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}  

export const authorise = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token; // ✅ assuming you set HttpOnly cookie

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const secret = process.env.JWT_SECRET || "secret123";
    const decoded = jwt.verify(token, secret);

    req.user = decoded; // attach to request object
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};