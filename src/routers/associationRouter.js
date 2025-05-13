import { Router } from "express";
import * as associationController from "../controllers/associationController.js";
//import { controllerWrapper as cw } from "./controllerWrapper.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

// http://localhost:3001/api/associations/1/animaux
router.get(
  "/associations/:id/animaux",
  associationController.getAllAnimalsByAssociation
);
router.get("/associations", associationController.getAllAssociations);
// router.get("/associations/:id", associationController.getOneAssociation);

// http://localhost:3001/api/associations/request/users/1
router.get(
  "/associations/request/users/:id",
  isAuth,
  associationController.getMessagesForAssociation
);

router.get("/associations/:id", associationController.getOneAssociation);
