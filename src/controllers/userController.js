import { User,Role } from "../models/index.js";
import Joi from 'joi';
import {hash, compare, generateJwtToken} from "../utils/crypto.js";
import { Op } from 'sequelize';

// http://localhost:3000/api/users


/**
 * Fonction qui récupère tous les utilisateurs
 * // http://localhost:3000/api/users
 */
export async function getAllUsers( req, res ){
  const users = await User.findAll(
    {
      // include: [
      //   { association: "role" },
      //   { association: "localisation" }
      // ],
      include: [ "role", "localisation" ],
      order: [
        ["id", "ASC"]
      ]
    });
  res.json(users);
}

/**
 * Fonction  qui supprime (DELETE)tous les utilisateurs
 * // http://localhost:3000/api/users/1
 */
export async function deleteUser(req, res,next) {
  const userId = parseInt( req.params.id );
  
  // Vérifier que cet ID est un entier
  if (!Number.isInteger(userId)) {
    return next();
  }
  // Récupérer user à supprimer en BDD
  const user = await User.findByPk(userId);
  if (!user) {
    return next();
  }

  await user.destroy();
  console.log( `User ${userId} supprimé` );
  res.status( 204 ).end();
  
}



/**
 * Fonction qui enregistre un nouvel utilisateur
 * // http://localhost:3000/api/register
 */
export async function register( req, res, next )
{
  const error = validate( req );
  // Si une erreur de validation existe, on la transmet au middleware d'erreur
  if ( error )
  {
    return next(error);
  }

  const { firstname, lastname, email, password, address, phone_number, rma_number, role_id,localisation_id } = req.body;


  // ----------
  const roleId = parseInt(req.body.role_id, 10);
  if (!Number.isInteger(roleId)) {
    return res.status(400).json({ error: "Le rôle est invalide." });
  }

  const role = await Role.findByPk(roleId);
  console.log("Rôle reçu :", role);

  if (!role) {
    return res.status(400).json({ error: "Le rôle spécifié est inexistant." });
  }

  if (role.name === "association" && !req.body.rma_number) {
    return res.status(400).json({ error: "Le numéro RNA est requis pour les associations." });
  }

  // -----------
  
  // Vérification email,téléphone,RNA déjà utilisés
  try {
    await checkDuplicates(email, phone_number, rma_number);

    const user = await User.create({
      firstname,
      lastname,
      password: await hash(password),
      email,
      address,
      phone_number,
      rma_number,
      role_id,
      localisation_id
      
    });
    console.log(`Création utilisateur : ${user.firstname} ${user.lastname} - ${user.email}`);
    console.log("role_id reçu :", req.body.role_id);

    res.status(201).json({ status: 201, user });
  }
  catch (error) {
    console.error('Erreur à l\'insertion :', error); 
    return next(error);
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


/**
 * Fonction qui permet à l'utilisateur mettre à jour ses informations
 * // http://localhost:3000/api/users/id
 */
export async function updateUser( req, res, next )
{
  const error = validate( req );
  // Si une erreur de validation existe, on la transmet au middleware d'erreur
  if ( error )
  {
    return next( error );
  }
  console.log( "Données reçues:", req.body );

  const userId = parseInt(req.params.id);  ;
  console.log( "Id récupéré:", userId );

  // Vérifier que cet ID est un entier
  if (!Number.isInteger(userId)) {
    return next();
  }

  // Extraction des données nécessaires depuis la requête
  const { firstname, lastname, email, password, address, phone_number, rma_number, role_id } = req.body;
  
  // Vérification email,téléphone,RNA déjà utilisés
  await checkDuplicates(email, phone_number, rma_number, userId);
  // Récupérer user en BDD
  const user = await User.findByPk( userId,
    {include:[ "role", "localisation" ]}
  );

  if ( !user )
  {
    return next();
  }

  //on met à jour s'il y a une modification sinon on n'y touche pas
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (password ) user.password = await hash(password);
  if (email) user.email = email;
  if (address) user.address = address;
  if (phone_number ) user.phone_number = phone_number;
  if (rma_number) user.rma_number = rma_number;
  
  //enregistrement en bdd
  await user.save();
    
  // Affichage des valeurs de l'utilisateur, avec le nom du rôle
  console.log( `
  ID: ${user.id}, 
  Prénom: ${user.firstname}, 
  Nom: ${user.lastname}, 
  Email: ${user.email}, 
  Adresse: ${user.address}, 
  Téléphone: ${user.phone_number}, 
  Numéro RMA: ${user.rma_number}, 
  Role: ${user.role.name}` );

  // Afficher un message indiquant si des champs ont été modifiés
  console.log( `✅ Utilisateur modifié : 
  ID: ${user.id}, 
  Prénom: ${firstname !== user.firstname ? `modifié de ${user.firstname} à ${firstname}` : user.firstname}, 
  Nom: ${lastname !== user.lastname ? `modifié de ${user.lastname} à ${lastname}` : user.lastname}, 
  Email: ${email !== user.email ? `modifié de ${user.email} à ${email}` : user.email}, 
  Adresse: ${address !== user.address ? `modifié de ${user.address} à ${address}` : user.address}, 
  Téléphone: ${phone_number !== user.phone_number ? `modifié de ${user.phone_number} à ${phone_number}` : user.phone_number}, 
  Numéro RMA: ${rma_number !== user.rma_number ? `modifié de ${user.rma_number} à ${rma_number}` : user.rma_number}, 
  Role ID: ${role_id !== user.role_id ? `modifié de ${user.role_id} à ${role_id}` : user.role_id}` );
  
  // On renvoie user modifié 200 = succès
  res.status( 200 ).json( user );
    
}

/**
     * Fonction qui permet de valider les données pour les enregistrements 
     */
function validate(req) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    password: passwordComplexity,
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    phone_number: Joi.string().required(),
    rma_number: Joi.string().pattern(/^W\d{9}$/).optional(),
    role_id: Joi.number().integer().required(),
    localisation_id: Joi.number().integer().required()
  });

  const error = schema.validate(req.body, { abortEarly: false }).error;

  return error
    ? { statusCode: 400, message: error.details.map(detail => detail.message) }
    : null;
}


/**
     * Controler le mot de passe
     */
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


/**
     * Fonction qui permet de controler les doublons lors de l'enregistrement
     */
async function checkDuplicates(email, phone_number, rma_number,userId) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { phone_number },
        // { rma_number }
      ]
    }
  });

  if (existingUser && existingUser.id !== userId) {
    if (existingUser.email === email) {
      throw { status: 409, message: "Email already taken" };
    }
    if (existingUser.phone_number === phone_number) {
      throw { status: 409, message: "Phone number already taken" };
    }
    // if (existingUser.rma_number === rma_number) {
    //   throw { status: 409, message: "RNA number already taken" };
    // }
  }
  return null; 
}
