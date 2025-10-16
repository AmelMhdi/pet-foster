import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IAnimal } from "../@types";
import { logError } from "../helpers/logError";
import { getAnimalsFromApi } from "../services/animalApi";

type Props = {
  limit?: number;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

export default function AnimalsContainer({ limit = 3, }: Props) {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [showAll, setShowAll] = useState(false);
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

  // const handleShowAll = () => {
  //   setShowAll(true);
  //   loadAnimals();
  // };

  return (
    <main>
      <div className="container mt-5 mb-5 fade-in">
        <div className="d-flex justify-content-center mb-4">
          <h1 className="section-title">Les animaux</h1>
        </div>

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {animals.map((animal) => (
                <div key={animal.id} className="col">
                  <div className="card-base card animal-card card-body-standard text-center shadow-sm">
                    <img
                      src={`${apiBaseUrl}/images/${animal.picture}.webp`}
                      alt={animal.name}
                      className="animal-img card-img-top img-fluid rounded-top"
                      loading="lazy"
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <p className="card-text">
                        <strong>{animal.name}</strong>
                      </p>
                      <Link
                        to={`/animaux/${animal.id}`}
                        className="details-btn btn btn-outline-primary mt-auto"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* {!showAll && animals.length >= limit && (
              <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-primary" onClick={handleShowAll}>
                  Afficher tous les animaux
                </button>
              </div>
            )} */}
          </>
        )}
      </div>
    </main>
  );
}
