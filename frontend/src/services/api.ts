import { IUser } from "../@types";
import { useUserStore } from "../store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiBaseUrl);

// --- Applications (messages) ---
export async function getUserMessageFromApi(
  userId: number,
  animalId: number
): Promise<string | null> {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    return null;
  }

  try {
    const url = `${apiBaseUrl}/applications/${animalId}/${userId}`;
    console.log("➡️ getUserMessageFromApi URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!animalId) {
      console.warn("⚠️ animalId est invalide :", animalId);
      return null;
    }

    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du message : ${response.status}`);
    }

    const data = await response.json();
    return data.message || [];
  } catch (error) {
    console.error("Erreur lors de la récupération du message :", error);
    return null;
  }
}

export async function getMessageForAssociationFromApi(userId: number) {
  const token = useUserStore.getState().user?.token;
  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    return [];
  }

  try {
    const response = await fetch (`${apiBaseUrl}/applications/association/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des messages : ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return [];
  }
}

export async function postUserMessageToApi(
  animalId: number,
  message: string
): Promise<string> {
  const token = useUserStore.getState().user?.token;
  console.log("Payload du message :", { animalId, message });

  if (!token) {
    console.error("Token non trouvé, utilisateur non connecté ?");
    throw new Error("Authentification requise.");
  }

  try {
    const response = await fetch(`${apiBaseUrl}/applications/${animalId}`, {
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
    const response = await fetch(`${apiBaseUrl}/associations`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des associations : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des associations :", error);
    return [];
  }
}

export async function fetchAssociationById(id: number): Promise<IUser | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/associations/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'association : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'association :", error);
    return null;
  }
}