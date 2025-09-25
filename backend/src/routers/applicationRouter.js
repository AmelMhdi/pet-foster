import { Router } from "express";
import * as applicationController from "../controllers/applicationController.js";

export const router = Router();

router.post("/applications/:animalId/:userId", applicationController.createOneMessage);
router.get("/applications/:animalId/:userId", applicationController.getOneMessage);