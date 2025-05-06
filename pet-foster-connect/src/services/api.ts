import { IAnimal } from "../@types";
import { ISpecies } from "../types";


const apiBaseUrl = "http://localhost:3001/api";

export const api = {
  fetchAnimals,
  getSpeciesFromApi
}

async function fetchAnimals(): Promise<IAnimal[]> {
  const response = await fetch(`${apiBaseUrl}/animals`)

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const animals: IAnimal[] = await response.json();
  return animals;
}

async function getSpeciesFromApi(): Promise<ISpecies[]> {
  const response = await fetch(`${apiBaseUrl}/animals/species`)

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const animals: IAnimal[] = await response.json();
  return animals;
}