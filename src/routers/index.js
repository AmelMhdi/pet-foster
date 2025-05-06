import { Router } from "express";
import { router as userRouter } from "./userRouter.js";
import { router as animalRouter } from "./animalRouter.js";

export const router = Router();

router.use("/users",userRouter);

router.use(animalRouter);

router.use((req, res) => {
  res.status(404).json({ error: "Ressource not found"});
});

