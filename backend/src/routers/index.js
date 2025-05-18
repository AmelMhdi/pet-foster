import { Router } from "express";
import { router as userRouter } from "./userRouter.js";
import { router as animalRouter } from "./animalRouter.js";
import { router as associationRouter } from "./associationRouter.js";

export const router = Router();

router.use("/users",userRouter);

router.use(animalRouter);

router.use(associationRouter);