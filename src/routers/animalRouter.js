import { Router } from "express";
import * as animalController from "../controllers/animalController.js";

export const router = Router();

router.get("/animals", animalController.getAllAnimals);
router.get("/animals/:id", animalController.getOneAnimal);
router.delete("/animals/:id", animalController.deleteAnimal);
router.post("/animals", animalController.createAnimal);
router.put("/animals/:id", animalController.updateAnimal);
