import { Request, Response } from "express";
import { Department } from "../models/department.model";

//#region Create Department
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const {
      departmentName,
      status,
      description,
      departmentHead,
      departmentHeadEmail,
      employeeCount,
      annualBudget,
      location,
    } = req.body;

    const existingDept = await Department.findOne({ departmentName });
    if (existingDept) {
      return res.status(400).json({saveStatus: false, message: "Department already exists" });
    }

    if(!departmentName || !departmentHead || !departmentHeadEmail || !annualBudget){
      return res.status(400).json({saveStatus: false, message: "Missing required fields" });
    }

    const newDept = await Department.create({
      departmentName,
      status,
      description,
      departmentHead,
      departmentHeadEmail,
      employeeCount,
      annualBudget,
      location,
    });

    return res.status(201).json({
      saveStatus: true,
      message: "Department created successfully",
      department: newDept,
    });
  } catch (error) {
    return res.status(500).json({
      saveStatus: false,
      message: "Error creating department",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

//#endregion

//#region Get All Departments
export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id).populate(
      "departmentHead",
      "email role"
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({
      saveStatus: false,
      message: "Error fetching department",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

//#endregion

//#region Get All Departments
export const getAllDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await Department.find().populate(
      "departmentHead",
      "email role"
    );
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({
      saveStatus: false,
      message: "Error fetching departments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
//#endregion

//#endregion Update a department
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDept = await Department.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedDept) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      saveStatus: true,
      message: "Department updated successfully",
      department: updatedDept,
    });
  } catch (error) {
    return res.status(500).json({
      saveStatus: false,
      message: "Error updating department",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
//#endregion

//#region Delete a department

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      saveStatus: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      saveStatus: false,
      message: "Error deleting department",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

//#endregion
