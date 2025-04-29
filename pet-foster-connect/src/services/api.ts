import { IAnimal } from "../@types";
import { IUser } from '../types';  

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

// créer un user, on envoie email et password on attend un nouveau user POST/users
export async function createUser(
  lastname: string,
  firstname: string,
  email: string,
  password: string,
  address: string,
  localisationId: number,  
  phone_number: string,
  roleId: number, 
   rma_number?: string  
): Promise<IUser | null>{
  try {

    // on donne aux données le nom attendu par l'api
    const data = { lastname, 
      firstname, 
      email, 
      password, 
      address, 
      phone_number, 
      rma_number, 
      role_id: roleId,     
      localisation_id: localisationId  };
    console.log("📤 Envoi de la requête...");
    console.log("➡️ Données envoyées :", data);

    // Envoi des données converties en JSON vers l'API
    const response = await fetch(apiBaseUrl + "/users/register" ,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📥 Réponse reçue !");
    console.log("ℹ️ Statut HTTP :", response.status, response.statusText);

    if (!response.ok) {
      console.error("❌ Erreur HTTP détectée !");
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

  // objet retourné par fetch, la methode json  lit le corps de la réponse et le convertit en objet JS
    const jsonResponse = await response.json();
    console.log("✅ Réponse JSON :", jsonResponse);

     return jsonResponse;
  } catch (error) {
    console.error("🚨 Erreur lors de la création :", error);
    return null;
  }
}

export async function getRolesFromApi(){
  try {
    const response = await fetch(apiBaseUrl + "/users/roles");
    if (response.ok && response.status === 200) {
      const roles = await response.json();
      return roles;
    }
    return [];
  } catch (error) {
    console.error("erreur lors de la récupération", error);
    return [];
  }
}

export async function getLocalisationsFromApi(){
  try {
    const response = await fetch(apiBaseUrl + "/users/localisations");
    if (response.ok && response.status === 200) {
      const localisations = await response.json();
      return localisations;
    }
    return [];
  } catch (error) {
    console.error("erreur lors de la récupération", error);
    return [];
  }
}