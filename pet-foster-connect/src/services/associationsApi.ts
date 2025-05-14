import {
  IPublicUser,
  IUserAnimal,
  IUserUpdateForm,
  IUserAnimalMessage,
} from "../@types/user-index";
import { useUserStore } from "../store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * Fonction qui récupère les animaux en fonction de l'association
 *
 */
export async function getAnimalsByAssociationFromApi(
  id: number
): Promise<IUserAnimal[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/associations/${id}/animals`);
    if (!response.ok) return [];

    const association = await response.json();
    console.log(association);
    return association;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Fonction qui récupère les informations provenant de l'api permettant de créer un utilisateur.
 *
 */
export async function updateAssociation(
  userData: IUserUpdateForm
): Promise<IPublicUser | { error: string }> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise");
  }
  try {
    // On extrait l'id et on garde le reste dans userDataSansId, nécessaire sinon bad request
    const { id, ...userDataSansId } = userData;

    // Vérification
    if (!id) {
      throw new Error("ID utilisateur manquant pour la mise à jour.");
    }

    console.log("Données envoyées SANS id :", userDataSansId);

    console.log("Envoi de la requête...");
    console.log("Données envoyées :", userData);

    const response = await fetch(`${apiBaseUrl}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDataSansId),
    });

    console.log("Réponse reçue !");
    console.log("ℹStatut HTTP :", response.status, response.statusText);

    const jsonResponse = await response.json();
    console.log("Réponse JSON :", jsonResponse);

    if (!response.ok) {
      console.error("Erreur HTTP détectée !");
      const errorMessage = Array.isArray(jsonResponse.error)
        ? jsonResponse.error.join(", ")
        : jsonResponse.error || `Erreur ${response.status}`;

      throw new Error(errorMessage);
    }

    return jsonResponse;
  } catch (error) {
    const err = error as Error;
    console.error("Erreur lors de la mise à jour :", err);
    return { error: err.message };
  }
}

/**
 * Fonction qui permet de récupérer un objet qui contient le message reçu par l'association avec le nom de la famille et de l'animal
 */

export async function getUserMessagesApi(
  userId: number
): Promise<IUserAnimalMessage[]> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise");
  }
  try {
    const response = await fetch(
      `${apiBaseUrl}/associations/request/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération du message: ${response.status}`
      );
    }

    const data: IUserAnimalMessage[] = await response.json();
    console.log("Données récupérées :", data);
    console.log("Message complet :", data[0]);
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return [];
  }
}
