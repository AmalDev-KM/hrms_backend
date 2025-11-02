import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import departmentRoutes from "./routes/department.routes";
import { requestLogger } from "./middlewares/logger.middleware";

dotenv.config();
const app = express();
const port = process.env.PORT || 6000;
const mongoDBUrl: string = process.env.MONGODB_URL || "";

// Parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
// Logs all requests in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Allow frontend to send cookies (CORS setup)
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true, // allow sending cookies
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes)

// Simple route
app.get("/", (_req: Request, res: Response) => {
  res.send("API is up and running!");
});

// Connect to MongoDB and start server
mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });