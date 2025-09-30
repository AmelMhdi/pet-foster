import { ILoginRequest, ILoginResponse, IPublicUser, IUser, IUserUpdateForm } from "../@types";
import { useUserStore } from "../store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Création d'un nouvel utilisateur
export async function createUser(userData: IUser): Promise<IUser | { error: string }> {
  try {
    const url = apiBaseUrl + "/users/register";
    console.log("URL complète appelée:", url);
    console.log("apiBaseUrl:", apiBaseUrl);

    const response = await fetch(url, {
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

// Récupération des rôles
export async function getRolesFromApi() {
  try {
    const response = await fetch(apiBaseUrl + "/users/roles");
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("erreur lors de la récupération des rôles", error);
    return [];
  }
}

// Récupération des utilisateurs
export async function getUsersFromApi(): Promise<IPublicUser[]> {
  try {
    const response = await fetch(apiBaseUrl + "/users");
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    return [];
  }
}

// Récupération d'un utilisateur par son ID
export async function getUserById(userId: number): Promise<IPublicUser | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/users/${userId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error);
    return null;
  }
}

// Connexion d'un utilisateur
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

// Mise à jour d'un utilisateur
export async function updateUserFromApi(userData:IUserUpdateForm): Promise<IPublicUser | { error : string }> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    return { error: "Authentification requise." };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/users/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const jsonResponse = await response.json();
    if (!response.ok) throw new Error(jsonResponse.error || `Erreur ${response.status}`);

    return jsonResponse;
  } catch (error) {
    const err = error as Error;
    console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
    return { error: err.message };
  }
}

// Suppression d'un utilisateur
export async function deleteUserFromApi(userId: number) {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
  }

  const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Échec lors de la suppression de l'utilisateur (${response.status}).`);
  }
}
