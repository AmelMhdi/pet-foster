import { IAnimal } from "../@types";


const apiBaseUrl = "http://localhost:3001/api";

export const api = {
  fetchAnimals,
  getAnimal,
  getUserMessageFromApi
}

async function fetchAnimals(): Promise<IAnimal[]> {
  const response = await fetch(`${apiBaseUrl}/animals`)
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const animals: IAnimal[] = await response.json();
  return animals;
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
    // envoyer userId et animalId pour récupérer le message
    const response = await fetch(`/api/request/animals/${animalId}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données récupérées :", data);
    if (data && data.message) {
      return data.message;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return null;
  }
}