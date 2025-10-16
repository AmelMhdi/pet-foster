import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

console.log("✅ userRouter chargé");

router.get("/roles", userController.getRoles);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getOneUser);

router.post("/register", userController.register);
router.post("/login", userController.login);

router.put("/:id", isAuth, userController.updateUser);
router.delete("/:id", isAuth, userController.deleteUser);
