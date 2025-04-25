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

/**
 * Fonction qui permet à l'utilisateur de se connecter
 * // http://localhost:3000/api/login
 */

export async function login(req, res) {
   
  const {email} = req.body;

  const user = await User.findOne({ where: { email }});
  if ( !user ) { return res.status( 400 ).json( { status: 401, message: "Invalid credentials" } ); }
  
  
  // Log l'utilisateur pour vérifier si le pseudonyme est bien présent
  console.log('Utilisateur:', user);

  res.status(200).json({ status: 200, userId: user.id });
}

// "password": "hashedpassword4",
//     "email": "david.lemoine@example.com",