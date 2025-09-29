import { Router } from "express";
import * as applicationController from "../controllers/applicationController.js";

export const router = Router();

router.post("/:animalId/:userId", applicationController.createOneMessage);
router.get("/:animalId/:userId", applicationController.getOneMessage);