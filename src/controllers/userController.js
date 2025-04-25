import { User } from "../models/index.js";

// http://localhost:3000/api/users


/**
 * Récupère tous les utilisateurs
 * @param {*} req
 * @param {*} res
 * @returns {Object} Utilisateur correspondant 
 */
export async function getAllUsers( req, res ){
  const users = await User.findAll();
  res.json(users);
}



