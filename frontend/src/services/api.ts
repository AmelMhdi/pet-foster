import { IAnimal, ISpecies, INewAnimal } from "../@types";
import { useUserStore } from "../store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiBaseUrl);

export const api = {
  fetchAnimals,
  getAnimal,
  getSpeciesFromApi,
  createAnimalFromApi,
  updateAnimalFromApi,
  deleteAnimalApi,
  getUserMessageFromApi,
  postUserMessageToApi,
}

// --- Animals ---
export async function fetchAnimals(): Promise<IAnimal[]> {
  const response = await fetch(`${apiBaseUrl}/animals`);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}

export async function getAnimal(id: number): Promise<IAnimal> {
  const response = await fetch(`${apiBaseUrl}/animals/${id}`)
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  const animal: IAnimal = await response.json();
  console.log(animal);
  return animal;
}

export async function getSpeciesFromApi(): Promise<ISpecies[]> {
  const response = await fetch(`${apiBaseUrl}/animals/species`);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  const species: ISpecies[] = await response.json();
  return species;
}

export async function createAnimalFromApi(
  animalData: INewAnimal
): Promise<IAnimal | { error: string }> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
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
    console.error("Erreur lors de la création d'un animal :", err);
    return { error: err.message };
  }
}

export async function updateAnimalFromApi(animalData: IAnimal): Promise<IAnimal | null> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
  }

  try {
    const response = await fetch(`${apiBaseUrl}/animals/${animalData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(animalData),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error("Erreur HTTP détectée !");
      const errorMessage = Array.isArray(jsonResponse.error)
        ? jsonResponse.error.join(", ")
        : jsonResponse.error || `Erreur ${response.status}`;

      throw new Error(errorMessage);
    }

    return jsonResponse;
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return null;
  }
}

export async function deleteAnimalApi(animalId: number): Promise<void> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
  }
  
  try {
    const response = await fetch(`${apiBaseUrl}/animals/${animalId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Échec de la suppression de l'animal.");
  }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'animal :", error);
    throw error;
  }
}

// --- Applications (messages) ---
export async function getUserMessageFromApi(
  userId: number,
  animalId: number
): Promise<string | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/applications/${animalId}/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du message : ${response.status}`);
  }

  const data = await response.json();
  return data.message || null;
  } catch (error) {
    console.error("Erreur lors de la récupération du message :", error);
    return null;
  }
}

export async function postUserMessageToApi(
  userId: number,
  animalId: number,
  message: string
): Promise<string> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
  }

  try {
    const response = await fetch(`${apiBaseUrl}/applications/${animalId}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error(`Erreur lors de l'envoi du message : ${response.status}`);
  }

  const data = await response.json();
  return data.message;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw error;
  }
}