import { Router } from "express";
import { router as userRouter } from "./userRouter.js";
import { router as animalRouter } from "./animalRouter.js";
import { router as applicationRouter } from "./applicationRouter.js";

export const router = Router();

console.log("✅ index router chargé");

router.use("/users", userRouter);
router.use("/animals", animalRouter);
router.use("/applications", applicationRouter);