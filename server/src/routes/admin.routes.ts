import { Router } from "express";
import { AdminController } from "../controllers/admin.controllers";
import { auth, isAdmin } from "../middlewares/auth.Middleware";

const router = Router();

const adminController = new AdminController();

router.get("/users", auth, isAdmin, adminController.getAllUsers);

router.delete("/user/:id", auth, isAdmin, adminController.deleteUser);

export default router;
