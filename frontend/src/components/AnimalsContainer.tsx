import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IAnimal } from "../@types";
import { logError } from "../helpers/logError";
import { getAnimalsFromApi } from "../services/animalApi";

type Props = {
  limit?: number;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

export default function AnimalsContainer({ limit = 3 }: Props) {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const fetched = await getAnimalsFromApi();
      setAnimals(fetched);
    } catch (error) {
      logError("Erreur lors du chargement des animaux :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  return (
    <main>
      <div className="animals-container fade-in">
        <div className="animals-header">
          <h1 className="animals-title">Les animaux</h1>
          <p className="animals-subtitle">Découvrez nos adorables compagnons à quatre pattes</p>
        </div>

        {loading ? (
          <p className="animals-loading">Chargement...</p>
        ) : (
          <>
            <div className="animals-grid">
              {animals.map((animal) => (
                <div key={animal.id} className="animal-card-wrapper">
                  <div className="animal-card-modern">
                    <img
                      src={`${apiBaseUrl}/images/${animal.picture}.webp`}
                      alt={animal.name}
                      className="animal-img"
                      loading="lazy"
                    />

                    <div className="animal-card-content">
                      <h2 className="animal-card-name">{animal.name}</h2>
                      <Link
                        to={`/animaux/${animal.id}`}
                        className="animal-details-btn"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
