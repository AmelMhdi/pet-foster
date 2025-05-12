
import { INewAnimal } from "../@types/user-index"
import { IAnimal, ISpecies, IUser } from "../@types";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = {
  fetchAnimals,
  getSpeciesFromApi,
  getAnimal,
  getUserMessageFromApi,
  postUserMessageToApi,
  fetchAssociations,
  fetchAssociationById
}

async function fetchAnimals(limit?: number, random?: boolean): Promise<IAnimal[]> {
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
  const response = await fetch(`${apiBaseUrl}/animals/${id}`)

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const animal: IAnimal = await response.json();
  console.log(animal);
  return animal;
}

export async function getUserMessageFromApi(userId: number, animalId: number): Promise<string | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/request/animals/${animalId}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du message: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données récupérées :", data);
    return data.message || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return null;
  }
}

export async function postUserMessageToApi(userId: number, animalId: number, message: string): Promise<string | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/request/animals/${animalId}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

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

export async function createAnimalFromApi(animalData: INewAnimal): Promise<IAnimal | null>{
  try {
    // console.log("Envoi de la requête...");
    // console.log("Données envoyées :", animalData);

    // Envoi des données converties en JSON vers l'API
    const response = await fetch(apiBaseUrl + "/animals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
             },
      body: JSON.stringify(animalData),
    });

    // console.log("Réponse reçue !");
    // console.log("ℹStatut HTTP :", response.status, response.statusText);

    // if (!response.ok) {
    // console.error("Erreur HTTP détectée !");
    // throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    // }

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
    console.error("Erreur lors de la création :", error);
    return null;
  }
}

export async function deleteAnimalApi(animalId: number) {
  const response = await fetch(`${apiBaseUrl}/animals/${animalId}`,{
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Échec de la suppression de l'animal");
  }
}

async function fetchAssociations(): Promise<IUser[]> {
  const response = await fetch(`${apiBaseUrl}/associations`)
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const associations: IUser[] = await response.json();
  return associations;
};

async function fetchAssociationById(id: number): Promise<IUser> {
  const response = await fetch(`${apiBaseUrl}/association/${id}`); 
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  const association: IUser = await response.json();
  return association;
}

