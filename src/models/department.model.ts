import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  departmentName: string;
  status: "active" | "inactive";
  description?: string;
  departmentHead: mongoose.Types.ObjectId; // Reference to User
  departmentHeadEmail: string;
  employeeCount: number;
  annualBudget: number;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    departmentName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
    },
    departmentHead: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    departmentHeadEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    annualBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Department = mongoose.model<IDepartment>(
  "Department",
  DepartmentSchema
);
