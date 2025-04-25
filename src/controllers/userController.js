import { User } from "../models/index.js";

// http://localhost:3000/api/users


/**
 * Fonction qui récupère tous les utilisateurs
 * // http://localhost:3000/api/users
 */
export async function getAllUsers( req, res ){
  const users = await User.findAll();
  res.json(users);
}


/**
 * Fonction qui enregistre un nouvel utilisateur
 * // http://localhost:3000/api/register
 */
export async function register(req, res) {
  const { firstname, lastname, email, password, address, phone_number, rma_number, role_id } = req.body;

  const user = await User.create({
    firstname,
    lastname,
    password,
    email,
    address,
    phone_number,
    rma_number,
    role_id
  });

  res.status(201).json({ status: 201, userId: user.id });
}

