import { Router } from "express";
import * as animalController from "../controllers/animalController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

router.get("/", animalController.getAllAnimals);
router.get("/:id", animalController.getOneAnimal);
router.get("/species", animalController.getSpecies);

router.post("/", isAuth, animalController.createAnimal);
router.put("/:id", isAuth, animalController.updateAnimal);
router.delete("/:id", isAuth, animalController.deleteAnimal);