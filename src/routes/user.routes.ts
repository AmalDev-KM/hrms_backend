import express from "express";
import { isAdmin } from "../middlewares/role.middleware";
import { authorise } from "../middlewares/auth.middleware";
import { approveUser, getAllUsers } from "../controllers/user.controller";

const router = express.Router();

router.get("/", authorise, isAdmin, getAllUsers);
router.put("/approve/:id", authorise, isAdmin, approveUser);
router.put("/de-activate/:id", authorise, isAdmin, approveUser);

export default router;
