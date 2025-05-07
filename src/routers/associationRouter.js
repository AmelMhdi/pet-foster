import { Router } from "express";
import * as associationController from "../controllers/associationController.js";
//import { controllerWrapper as cw } from "./controllerWrapper.js";

export const router = Router();


// http://localhost:3001/api/associations/1/animaux
router.get( "/associations/:id/animaux", associationController.getAllAnimalsByAssociation );
router.get("/associations", associationController.getAllAssociations);
router.get("/associations/:id", associationController.getOneAssociation);

