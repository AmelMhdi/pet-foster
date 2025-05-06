import { ILoginRequest, ILoginResponse, IUser } from "../@types/user-index";

const apiBaseUrl = "http://localhost:3001/api";

/**
 * Fonction qui récupère les informations provenant de l'api permettant de créer un utilisateur
 */

// crée un user, on envoie email et password, on attend un nouveau user POST/users
export async function createUser(userData:IUser): Promise<IUser | null>{
  try {
    console.log("Envoi de la requête...");
    console.log("Données envoyées :", userData);

    // Envoi des données converties en JSON vers l'API
    const response = await fetch(apiBaseUrl + "/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Réponse reçue !");
    console.log("ℹStatut HTTP :", response.status, response.statusText);

    if (!response.ok) {
      console.error("Erreur HTTP détectée !");
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    // objet retourné par fetch, la methode json lit le corps de la réponse et le convertit en objet JS
    const jsonResponse = await response.json();
    console.log("Réponse JSON :", jsonResponse);

    return jsonResponse;
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    return null;
  }
}

/**
 * Fonction qui récupère tous les roles qui proviennent de l'api
 * 
 */
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

/**
 * Fonction qui récupère toutes les localisations qui proviennent de l'api
 * 
 */
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

/**
 * Fonction qui récupère tous les users
 * 
 */
export async function getUsersFromApi(): Promise<IUser[]> {
  try {
    const response = await fetch(apiBaseUrl + "/users");
    if (response.ok && response.status === 200) {
      const users = await response.json();
      return users;
    }
    return [];
  } catch (error) {
    console.error("erreur lors de la récupération", error);
    return [];
  }
}

export async function loginFromApi(body:ILoginRequest): Promise<ILoginResponse> {
  const response = await fetch(apiBaseUrl + "/users/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
  
  console.log("Réponse API avant retour : ", response);  

  if (!response.ok) {
    throw new Error("Erreur lors de l'authentification");
  }

  const data = await response.json();
  console.log("Réponse API (données JSON) : ", data);
  return data;
}
