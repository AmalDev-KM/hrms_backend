import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller";
import {  authorise } from "../middlewares/auth.middleware";
import { isAdminOrHR } from "../middlewares/role.middleware";

const router = express.Router();

// Only Admin or HR can manage departments
router.post("/", authorise, isAdminOrHR, createDepartment);
router.get("/", authorise, getAllDepartments);
router.get("/:id", authorise, getDepartmentById);
router.put("/:id", authorise, isAdminOrHR, updateDepartment);
router.delete("/:id", authorise, isAdminOrHR, deleteDepartment);

export default router;
