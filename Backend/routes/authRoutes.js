import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/login", login);

// Protected Routes (Required JWT Token)
router.post("/register", protect, authorizeRoles("Super Admin"), register);
router.get("/me", protect, getMe);

export default router;
