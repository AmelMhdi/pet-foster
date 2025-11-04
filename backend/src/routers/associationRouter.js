import { Router } from "express";
import * as userController from "../controllers/userController.js";

export const router = Router();

router.get("/", userController.getAllAssociations);
router.get("/:id", userController.getOneAssociation);