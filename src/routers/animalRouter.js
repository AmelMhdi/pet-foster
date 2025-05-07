import { Router } from "express";
import * as animalController from "../controllers/animalController.js";

export const router = Router();

router.get("/animals", animalController.getAllAnimals);
router.get("/animals/:id", animalController.getOneAnimal);
router.delete("/animals/:id", animalController.deleteAnimal);
router.post("/animals", animalController.createAnimal);
router.put("/animals/:id", animalController.updateAnimal);

router.get("/request/animals/users", animalController.getMessages);
router.get("/request/animals/:animalId/users/:userId", animalController.getOneMessage);
router.post("/request/animals/:animalId/users/:userId", animalController.createOneMessage);
