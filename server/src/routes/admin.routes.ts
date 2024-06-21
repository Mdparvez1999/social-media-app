import { Router } from "express";
import { deleteUser, getAllUsers } from "../controllers/admin.controllers";
import { auth, isAdmin } from "../middlewares/auth.Middleware";

const router = Router();

router.get("/users", auth, isAdmin, getAllUsers);

router.delete("/user/:id", auth, isAdmin, deleteUser);

export default router;
