import { User} from "../models/index.js";
import { User_animal } from "../models/index.js";


/**
 * Fonction qui permet de récuperer les animaux en fonction d'une association 
 * // http://localhost:3001/api/associations/:id/animaux
 */

export async function getAllAnimalsByAssociation( req, res, next )
{
  const userId = parseInt( req.params.id );
  if (!Number.isInteger(userId)) {
    return next;
  }
    
  const user = await User.findByPk( userId, {
    include: {
      association: "animals_asso", // alias exact défini dans User.hasMany(Animal)
      include: {
        association: "species" // alias exact défini dans Animal.belongsTo(Species)
      }
    }
  });

  if (!user) {
    return next();
  }

  // Les renvoyer au format JSON
  // res.status( 200 ).json( user );
  res.status(200).json(user.animals_asso);
}

export async function getAllAssociations(req, res) {
  try {
    const associations = await User.findAll({
      include: [
        {
          association: "role",
          where: { id: 1 } 
        },
        {
          association: "localisation"
        }
      ]
    });
    res.json(associations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des associations." });
  }
};

export async function getOneAssociation(req, res) {
  try {
    const associationId = parseInt(req.params.id);
    const association = await User.findByPk(associationId, {
      include: {
        association: "animals_asso",
        include: {
          association: "localisation"
        }
      }
    });
    res.json(association);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération d'une association"});
  }
};