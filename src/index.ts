import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 6000;
const mongoDBUrl: string = process.env.MONGODB_URL || "";

// Parse JSON
app.use(express.json());

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