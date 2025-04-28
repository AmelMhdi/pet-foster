import { IAnimal } from "../@types";

const apiBaseUrl = "http://localhost:3001/api";

export const api = {
  fetchAnimals,
}

async function fetchAnimals(): Promise<IAnimal[]> {
  const response = await fetch(`${apiBaseUrl}/animals`)
  const animals = await response.json()
  return animals;
}
