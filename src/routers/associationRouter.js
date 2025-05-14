import { Router } from "express";
import * as associationController from "../controllers/associationController.js";
//import { controllerWrapper as cw } from "./controllerWrapper.js";
import { validateId } from "../middlewares/validateId.js";

export const router = Router();

router.get("/associations/:id/animals", associationController.getAllAnimalsByAssociation);
router.get("/associations", associationController.getAllAssociations);
router.get("/associations/request/users/:id",associationController.getMessagesForAssociation);
router.get("/associations/:id",validateId,associationController.getOneAssociation);
