import { User } from "../models/index.js";
import Joi from 'joi';
import {hash} from "../utils/crypto.js";
import { Op } from 'sequelize';

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
export async function register( req, res )
{
  // bibliotheque de valisation Joi qui permet de valider les donnees reçues en vérifiant le respect du format attendu
  const schema = Joi.object( {
    firstname: Joi.string().min(3).max(30).required(),
    lastname:Joi.string().min(3).max(30).required(),
    password:Joi.string().required(),
    email:Joi.string().email().required(),
    address:Joi.string().required(),
    phone_number:Joi.string().required(),
    rma_number:Joi.string().pattern(/^W\d{9}$/).required(),  //w+9chiffres
    role_id:Joi.number().integer().required()
  });

  const { error } = schema.validate(req.body);
  if ( error )
  {
    console.log('Validation Error:', error.details[0].message); 
    return res.status(400).json({ status: 400, message: error.details[0].message });
  }

  const { firstname, lastname, email, password, address, phone_number, rma_number, role_id } = req.body;

  // Vérification email,téléphone,RNA déjà utilisés
  try {
    const existingUser = await User.findOne( {
      where: {
        [Op.or]: [
          { email },
          { phone_number },
          { rma_number }
        ]
      }
    } );
    
    if (existingUser) {
      if (existingUser.email === email) {
        console.log('📧 Email déjà utilisé :', email);
        return res.status(409).json({ status: 409, message: "Email already taken" });
      }

      if (existingUser.phone_number === phone_number) {
        console.log('📱 Numéro déjà utilisé :', phone_number);
        return res.status(409).json({ status: 409, message: "Phone number already taken" });
      }

      if (existingUser.rma_number === rma_number) {
        console.log('📱 Numéro RNA déjà utilisé :', rma_number);
        return res.status(409).json({ status: 409, message: "RNA number already taken" });
      }
    }

    const user = await User.create({
      firstname,
      lastname,
      password: await hash(password),
      email,
      address,
      phone_number,
      rma_number,
      role_id
    });
    console.log(`📥 Création utilisateur : ${user.firstname} ${user.lastname} - ${user.email}`);

    res.status(201).json({ status: 201, userId: user.id });
  }
  catch (error) {
    console.error('Erreur à l\'insertion :', error); 
    res.status(500).json({ status: 500, message: "Erreur lors de la création de l'utilisateur" });
  }
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