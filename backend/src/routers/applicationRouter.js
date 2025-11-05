import { Router } from "express";
import * as applicationController from "../controllers/applicationController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

router.post("/:animalId", isAuth, applicationController.createOneMessage);
router.get("/:animalId/:userId", isAuth, applicationController.getOneMessage);