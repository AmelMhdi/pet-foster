import { User} from "../models/index.js";



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
