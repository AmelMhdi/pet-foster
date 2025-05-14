import { Router } from "express";
import * as associationController from "../controllers/associationController.js";
//import { controllerWrapper as cw } from "./controllerWrapper.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

export const router = Router();

router.get(
  "/associations/:id/animals",
  associationController.getAllAnimalsByAssociation
);
router.get("/associations", associationController.getAllAssociations);
// router.get("/associations/:id", associationController.getOneAssociation);

router.get(
  "/associations/request/users/:id",
  isAuth,
  associationController.getMessagesForAssociation
);

router.get("/associations/:id", associationController.getOneAssociation);
