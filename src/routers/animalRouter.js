import { Router } from "express";
import * as animalController from "../controllers/animalController.js";

export const router = Router();

router.get("/animals", animalController.getAllAnimals);
router.get("/animal/:id", animalController.getOneAnimal);
router.delete("/animal/:id", animalController.deleteAnimal);
router.post("/animal", animalController.createAnimal);
router.patch("/animal/:id", animalController.updateAnimal);
