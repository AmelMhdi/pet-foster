import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

router.get("/", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);

router.put("/:id", isAuth, userController.updateUser);
router.delete("/:id", isAuth, userController.deleteUser);

router.get("/roles", userController.getRoles);
// router.get("/localisations", userController.getLocalisations);