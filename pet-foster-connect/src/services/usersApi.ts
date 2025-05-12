import { ILoginRequest, ILoginResponse, IUser } from "../@types/user-index";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * Fonction qui récupère les informations provenant de l'api permettant de créer un utilisateur
 */

// crée un user, on envoie email et password, on attend un nouveau user POST/users
export async function createUser(
  userData: IUser
): Promise<IUser | { error: string }> {
  try {
    const response = await fetch(apiBaseUrl + "/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
    const err = error as Error;
    console.error("Erreur lors de la création :", err);
    return { error: err.message };
  }
}

/**
 * Fonction qui récupère tous les roles qui proviennent de l'api
 *
 */
export async function getRolesFromApi() {
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
export async function getLocalisationsFromApi() {
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

export async function loginFromApi(
  userData: ILoginRequest
): Promise<ILoginResponse> {
  const response = await fetch(apiBaseUrl + "/users/login", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("Erreur HTTP détectée !");
    throw new Error(data.error || `Erreur ${response.status}`);
  }
  return data;
}

/**
 * Fonction qui de supprimer le profil
 */

export async function deleteUserFromApi(userId: number) {
  const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Échec de la suppression de l'animal");
  }
}
