import { IAnimal } from "../@types";


const apiBaseUrl = "http://localhost:3001/api";

export const api = {
  fetchAnimals,
  getAnimal
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