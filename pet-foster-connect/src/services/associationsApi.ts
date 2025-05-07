import { IPublicUser, IUserAnimal, IUserUpdateForm } from "../@types/user-index";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * Fonction qui récupère les animaux en fonction de l'association
 * 
 */
export async function getAnimalsByAssociationFromApi(id:number): Promise<IUserAnimal []>{
  try {
const response = await fetch(`${apiBaseUrl}/associations/${id}/animaux`);
    if (!response.ok) return [];
    
    const association = await response.json();
    console.log(association)
    return association
       
  } catch (error) {
     console.log(error);
    return [];
  }
}

/**
 * Fonction qui récupère les informations provenant de l'api permettant de créer un utilisateur. Ce type représente les données User envoyées à l’API IUserUpdateForm pour mettre à jour un utilisateur IPublicUser
 * 
 */
export async function updateAssociation(userData:IUserUpdateForm): Promise<IPublicUser | null>{
  try {

  // 🔹 On extrait l'id et on garde le reste dans userDataSansId, nécessaire sinon bad request
    const { id, ...userDataSansId } = userData;

    // 🔹 Vérification
    if (!id) {
      throw new Error("ID utilisateur manquant pour la mise à jour.");
    }

    console.log("Données envoyées SANS id :", userDataSansId);


    console.log("Envoi de la requête...");
    console.log("Données envoyées :", userData);

    const response = await fetch(`${apiBaseUrl}/users/${id}` ,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataSansId),
    });

    console.log("Réponse reçue !");
    console.log("ℹStatut HTTP :", response.status, response.statusText);

    if (!response.ok) {
      console.error(" Erreur HTTP détectée !");
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    console.log("Réponse JSON :", jsonResponse);

     return jsonResponse;
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return null;
  }
}
