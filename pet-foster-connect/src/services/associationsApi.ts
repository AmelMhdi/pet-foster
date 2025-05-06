import {  IUserAnimal,IPublicUser, IUserUpdateForm } from '../types';  

const apiBaseUrl = "http://localhost:3001/api";

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
// créer un user, on envoie email et password on attend un nouveau user POST/users
export async function updateAssociation(userData:IUserUpdateForm): Promise<IPublicUser | null>{
  try {

    console.log("Envoi de la requête...");
    console.log("Données envoyées :", userData);

     // Transformation simple à la volée
    const { localisation_id, ...rest } = userData;

    const payload = {
      ...rest,
      localisation: { id: localisation_id },
    };

    console.log("Payload envoyé :", payload);


    // Envoi des données converties en JSON vers l'API
    const response = await fetch(`${apiBaseUrl}/users/${userData.id}` ,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Réponse reçue !");
    console.log("ℹStatut HTTP :", response.status, response.statusText);

    if (!response.ok) {
      console.error(" Erreur HTTP détectée !");
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

  // objet retourné par fetch, la methode json  lit le corps de la réponse et le convertit en objet JS
    const jsonResponse = await response.json();
    console.log("Réponse JSON :", jsonResponse);

     return jsonResponse;
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return null;
  }
}
