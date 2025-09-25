import { Router } from "express";
import { isAuth } from "../middlewares/authentication.middleware";
import * as applicationController from "../controllers/applicationController";

export const router = Router();

router.post("/:animalId/:userId", isAuth, applicationController.createOneMessage);
router.get("/:animalId/:userId", isAuth, applicationController.getOneMessage);