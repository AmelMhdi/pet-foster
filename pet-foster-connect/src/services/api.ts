import { IAnimal, ISpecies, IUser, IAssociationDetail } from "../@types";
import { INewAnimal } from "../@types/user-index";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { useUserStore } from "../store";

export const api = {
  fetchAnimals,
  getSpeciesFromApi,
  getAnimal,
  getUserMessageFromApi,
  postUserMessageToApi,
  fetchAssociations,
  fetchAssociationById,
};

async function fetchAnimals(
  limit?: number,
  random?: boolean
): Promise<IAnimal[]> {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (random) params.append("random", "true");

  const response = await fetch(`${apiBaseUrl}/animals?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  return response.json();
}

async function getSpeciesFromApi(): Promise<ISpecies[]> {
  const response = await fetch(`${apiBaseUrl}/animals/species`);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const species: ISpecies[] = await response.json();
  return species;
}

async function getAnimal(id: number): Promise<IAnimal> {
  const response = await fetch(`${apiBaseUrl}/animals/${id}`);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const animal: IAnimal = await response.json();
  console.log(animal);
  return animal;
}

async function getUserMessageFromApi(
  userId: number,
  animalId: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/request/animals/${animalId}/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération du message: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Données récupérées :", data);
    return data.message || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return null;
  }
}

async function postUserMessageToApi(
  userId: number,
  animalId: number,
  message: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/request/animals/${animalId}/users/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi du message: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
}

export async function createAnimalFromApi(
  animalData: INewAnimal
): Promise<IAnimal | { error: string }> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise");
  }

  try {
    const response = await fetch(apiBaseUrl + "/animals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(animalData),
    });
    console.log(response);
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
    console.error("Erreur lors de la création :", err);
    return { error: err.message };
  }
}

export async function deleteAnimalApi(animalId: number) {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise");
  }
  const response = await fetch(`${apiBaseUrl}/animals/${animalId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Échec de la suppression de l'animal");
  }
}

async function fetchAssociations(): Promise<IUser[]> {
  const response = await fetch(`${apiBaseUrl}/associations`);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const associations: IUser[] = await response.json();
  return associations;
}

export async function fetchAssociationById(
  id: number
): Promise<IAssociationDetail> {
  const response = await fetch(`${apiBaseUrl}/associations/${id}`);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  const association: IAssociationDetail = await response.json();
  return association;
}
