import {  IUserAnimal} from '../types';  

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