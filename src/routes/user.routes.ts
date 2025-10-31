import express from "express";
import { isAdmin } from "../middlewares/role.middleware";
import { authorise } from "../middlewares/auth.middleware";
import { approveUser } from "../controllers/user.controller";

const router = express.Router();

// Only admin can approve users
router.put("/approve/:id", authorise, isAdmin, approveUser);

export default router;
