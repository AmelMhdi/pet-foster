import { IAnimal, INewAnimal, ISpecies } from "../@types";
import { useUserStore } from "../store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Récupérer tous les animaux
export async function getAnimalsFromApi(): Promise<IAnimal[]> {
	try {
		const response = await fetch(`${apiBaseUrl}/animals`);
		if (!response.ok) {
			throw new Error(`Erreur lors de la récupération des animaux : ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Erreur lors de la récupération des animaux :", error);
		return [];
	}
}

// Récupérer un animal par son ID
export async function getAnimalByIdFromApi(id: number): Promise<IAnimal | null> {
	try {
		const response = await fetch(`${apiBaseUrl}/animals/${id}`);
		if (!response.ok) {
			if (response.status === 404) return null; // Animal non trouvé
			throw new Error(`Erreur lors de la récupération de l'animal avec l'ID ${id} : ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(`Erreur lors de la récupération de l'animal avec l'ID ${id} :`, error);
		return null;
	}
}

// Récupérer les animaux d'un utilisateur (association)
export async function getAnimalsByUserIdFromApi(userId: number): Promise<IAnimal[]> {
	try {
		const response = await fetch(`${apiBaseUrl}/users/${userId}/animals`);
		if (!response.ok) {
			throw new Error(`Erreur lors de la récupération des animaux pour l'utilisateur avec l'ID ${userId} : ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(`Erreur lors de la récupération des animaux pour l'utilisateur avec l'ID ${userId} :`, error);
		return [];
	}
}

// Récupérer toutes les espèces
export async function getSpeciesFromApi(): Promise<ISpecies[]> {
  const response = await fetch(`${apiBaseUrl}/animals/species`);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  const species: ISpecies[] = await response.json();
  return species;
}

// Créer un nouvel animal (utilisateur authentifié)
export async function createAnimalFromApi(animalData: INewAnimal): Promise<IAnimal | { error: string }> {
	const token = useUserStore.getState().user?.token;
	if (!token) {
		return { error: "Authentification requise." };
	}

	try {
		const response = await fetch(`${apiBaseUrl}/animals`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify(animalData)
		});

		const jsonResponse = await response.json();
		if (!response.ok) {
			const errorMessage = Array.isArray(jsonResponse.error)
				? jsonResponse.error.join(", ")
				: jsonResponse.error || `Erreur lors de la création de l'animal : ${response.status}`;
			throw new Error(errorMessage);
		}

		return jsonResponse;
	} catch (error) {
		console.error("Erreur lors de la création de l'animal :", error);
		return { error: (error as Error).message || "Erreur lors de la création de l'animal" };
	}
}

// Mettre à jour un animal (utilisateur authentifié)
export async function updateAnimalFromApi(id: number, animalData: Partial<INewAnimal>): Promise<IAnimal | { error: string }> {
	const token = useUserStore.getState().user?.token;
	if (!token) {
		return { error: "Authentification requise." };
	}

	try {
		const response = await fetch(`${apiBaseUrl}/animals/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify(animalData)
		});

		const jsonResponse = await response.json();
		if (!response.ok) {
			throw new Error(jsonResponse.error || `Erreur lors de la mise à jour de l'animal avec l'ID ${id} : ${response.status}`);
		}

		return jsonResponse;
	} catch (error) {
		console.error(`Erreur lors de la mise à jour de l'animal avec l'ID ${id} :`, error);
		return { error: (error as Error).message || "Erreur lors de la mise à jour de l'animal" };
	}
}

// Supprimer un animal (utilisateur authentifié)
export async function deleteAnimalFromApi(id: number): Promise<void> {
	const token = useUserStore.getState().user?.token;
	if (!token) {
		throw new Error("Authentification requise.");
	}

	const response = await fetch(`${apiBaseUrl}/animals/${id}`, {
		method: "DELETE",
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error(`Erreur lors de la suppression de l'animal avec l'ID ${id} : ${response.status}`);
	}
}