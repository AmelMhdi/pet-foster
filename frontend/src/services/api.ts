import { IUser } from "../@types";
import { useUserStore } from "../store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiBaseUrl);

// --- Applications (messages) ---
export async function getUserMessageFromApi(
  userId: number,
  animalId: number
): Promise<string | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/applications/${animalId}/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du message : ${response.status}`);
  }

  const data = await response.json();
  return data.message || null;
  } catch (error) {
    console.error("Erreur lors de la récupération du message :", error);
    return null;
  }
}

export async function postUserMessageToApi(
  userId: number,
  animalId: number,
  message: string
): Promise<string> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
  }

  try {
    const response = await fetch(`${apiBaseUrl}/applications/${animalId}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error(`Erreur lors de l'envoi du message : ${response.status}`);
  }

  const data = await response.json();
  return data.message;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw error;
  }
}

// --- Associations (users) ---
export async function fetchAssociations(): Promise<IUser[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/users?role=association`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des associations : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des associations :", error);
    return [];
  }
}