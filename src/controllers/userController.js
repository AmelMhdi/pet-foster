import { User } from "../models/index.js";
import Joi from 'joi';
import {hash, compare, generateJwtToken} from "../utils/crypto.js";
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
export async function register( req, res, next )
{
  const error = validate( req );
  
  if ( error )
  {
    return next(error);
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
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  } );
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(401).json({ status: 400, message: error.details[0].message });
  } 

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email }});
  if ( !user ) { return res.status( 400 ).json( { status: 401, message: "Invalid credentials" } ); }
  
  // Fonction de argon2 stockée dans crypto, pour comparer le mot de passe saisi et celui de la bdd
  const validPassword = await compare( password, user.password );
  
  console.log({ validPassword });
  if (!validPassword) {
    return res.status(401).json({ status: 401, message: "Invalid credentials" });
  }
  console.log( 'Utilisateur connecté, ID:', user.id );  
  
  const token = generateJwtToken({ userId: user.id });
  res.json({ token, expiresIn: "1d" ,firstname:user.firstname});
}

function validate(req) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    password: passwordComplexity,
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    phone_number: Joi.string().required(),
    rma_number: Joi.string().pattern(/^W\d{9}$/).required(),
    role_id: Joi.number().integer().required()
  });

  const error = schema.validate(req.body, { abortEarly: false }).error;

  return error
    ? { statusCode: 400, message: error.details.map(detail => detail.message) }
    : null;
}

const passwordComplexity = Joi.string()
  .min(12)
  .max(100)
  .pattern(/[A-Z]/, 'majuscule').message('Le mot de passe doit contenir au moins une lettre majuscule')
  .pattern(/[a-z]/, 'minuscule').message('Le mot de passe doit contenir au moins une lettre minuscule')
  .pattern(/[0-9]/, 'chiffre').message('Le mot de passe doit contenir au moins un chiffre')
  .pattern(/[\W_]/, 'symbole').message('Le mot de passe doit contenir au moins un symbole')
  .pattern(/^\S*$/, 'pas d\'espace').message('Le mot de passe ne doit pas contenir d\'espace')
  .required()
  ;