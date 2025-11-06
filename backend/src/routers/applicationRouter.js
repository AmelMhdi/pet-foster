import { Router } from "express";
import * as applicationController from "../controllers/applicationController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

console.log("✅ applicationRouter monté sur /applications");

router.post("/:animalId", isAuth, applicationController.createOneMessage);
router.get("/user/:userId/animal/:animalId", isAuth, applicationController.getOneMessage);