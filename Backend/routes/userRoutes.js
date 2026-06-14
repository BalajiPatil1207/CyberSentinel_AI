import express from "express";
import { getUsers, updateUserStatus } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All user management endpoints require authentication and "Super Admin" role
router.use(protect);
router.use(authorizeRoles("Super Admin"));

router.route("/").get(getUsers);
router.route("/:id/status").put(updateUserStatus);

export default router;
