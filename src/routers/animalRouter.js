import { Router } from "express";
import * as animalController from "../controllers/animalController.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

router.get("/animals", animalController.getAllAnimals);
router.get("/animals/species", animalController.getSpecies);
router.get("/animals/:id", animalController.getOneAnimal);
router.delete("/animals/:id", isAuth, animalController.deleteAnimal);
router.post("/animals", isAuth, animalController.createAnimal);
router.put("/animals/:id", isAuth, animalController.updateAnimal);

router.get("/request/animals/users", animalController.getMessages);
router.get("/request/animals/:animalId/users/:userId", animalController.getOneMessage);
router.post("/request/animals/:animalId/users/:userId", isAuth, animalController.createOneMessage);
