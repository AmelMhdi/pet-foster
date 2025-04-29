import { IAnimal } from "../@types";

const apiBaseUrl = "http://localhost:3001/api";

export const api = {
  fetchAnimals,
}

async function fetchAnimals(): Promise<IAnimal[]> {
  const response = await fetch(`${apiBaseUrl}/animals`)

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const animals: IAnimal[] = await response.json();
  return animals;
}
