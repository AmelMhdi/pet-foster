import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { IAnimal } from "../@types";
import { logError } from "../helpers/logError";

type Props = {
  limit?: number;
  random?: boolean;
};

export default function AnimalsContainer({ limit = 3, random }: Props) {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAnimals = async (all: boolean) => {
    try {
      setLoading(true);
      const fetched = await api.fetchAnimals(all ? undefined : limit, random);
      setAnimals(fetched);
    } catch (error) {
      logError("Erreur lors du chargement des animaux :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals(false);
  }, [random]);

  const handleShowAll = () => {
    setShowAll(true);
    loadAnimals(true);
  };

  return (
    <main>
      <div className="container mt-5 fade-in">
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
                  <div className="card-base card animal-card card-body-standard h-100 text-center shadow-sm">
                    <img
                      src={animal.picture}
                      alt={animal.name}
                      className="animal-img card-img-top img-fluid rounded-top"
                      loading="lazy"
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <p className="card-text mb-3">
                        <strong>{animal.name}</strong>
                      </p>
                      <Link
                        to={`/animals/${animal.id}`}
                        className="btn btn-outline-primary mt-auto"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!showAll && animals.length >= limit && (
              <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-primary" onClick={handleShowAll}>
                  Afficher tous les animaux
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
