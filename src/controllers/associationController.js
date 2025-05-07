import { User, User_animal} from "../models/index.js";
// import { User_animal } from "../models/index.js";


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


// export async function getOneMessage( req, res, next )
// {
//   const userId = parseInt( req.params.id );
//   if (!Number.isInteger(userId)) {
//     return next;
//   }
    
//   const getMessageByAssociation = await User.findByPk( userId, {
//     include: {
//       association: "User_animal",
//       include: [
//         { association: 'user' },
//         { association: 'animal' }
//       ]
//     }
//   });

//   if (!getMessageByAssociation) {
//     return next();
//   }
  
//   return res.status( 200 ).json([
//     {
//       message: getMessageByAssociation.message,
//       user: {
//         firstname: getMessageByAssociation.user.firstname,
//         lastname: getMessageByAssociation.user.lastname
//       },
//       animal: {
//         name: getMessageByAssociation.animal.name
//       },
//       created_at: getMessageByAssociation.created_at
//     }
//   ]);
// }

// // http://localhost:3001/api/associations/request/users/1
export async function getMessagesForAssociation( req, res, next )
{
  const associationId = parseInt( req.params.id);
  if (!Number.isInteger(associationId)) {
    return next;
  }
    
  const getMessages = await User_animal.findAll(
    {
      include: [
        {association:"animal",
          where: { user_id: associationId } // animaux de l'association
        },
        { association :"user", // c’est la famille qui a envoyé la demande
         
        }
      ]
    });

  if (!getMessages) {
    return next();
  }

  // Mapper pour obtenir le format souhaité : un tableau d'objet
  const formatted = getMessages.map((demande) => {
    return {
      message: demande.message,
      userId: demande.user.id,
      prenom: demande.user.firstname,
      nom: demande.user.lastname,
      email: demande.user.email,
      animal: demande.animal.name,
      createdAt: demande.createdAt ? demande.createdAt.toISOString() : null 
    };
  });

  return res.status(200).json(formatted);
}

