import { Router } from "express";
import * as animalController from "../controllers/animalController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

router.get("/animals", animalController.getAllAnimals);
router.get("/animals/:id", animalController.getOneAnimal);
router.get("/animals/species", animalController.getSpecies);

router.post("/animals", isAuth, animalController.createAnimal);
router.put("/animals/:id", isAuth, animalController.updateAnimal);
router.delete("/animals/:id", isAuth, animalController.deleteAnimal);