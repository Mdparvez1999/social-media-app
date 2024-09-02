import { Router } from "express";
import { AdminController } from "../controllers/admin.controllers";
import { auth, isAdmin } from "../middlewares/auth.Middleware";

const router = Router();
const adminController = new AdminController();

// Get all users (Admin only)
router.get("/users", auth, isAdmin, adminController.getAllUsers);

// Delete a user by ID (Admin only)
router.delete("/users/:id", auth, isAdmin, adminController.deleteUser);

export default router;
