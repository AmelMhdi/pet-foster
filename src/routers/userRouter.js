import { Router } from "express";
import * as userController from "../controllers/userController.js";


export const router = Router();

router.get("/", userController.getAllUsers);

//TODO 
// router.post("/api/register", (userController.register));

