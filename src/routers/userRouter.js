import { Router } from "express";
import * as userController from "../controllers/userController.js";


export const router = Router();

router.get("/", userController.getAllUsers);
router.post("/register", userController.register);
router.post( "/login", userController.login );

router.put( "/:id", userController.updateUser );
router.delete( "/:id", userController.deleteUser );

router.get("/roles", userController.getRoles);
router.get( "/localisations", userController.getLocalisations );

