import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { IAnimal } from "../@types";
import { logError } from "../helpers/logError";

type Props = {
  limit?: number;
  random?: boolean;
  pagination?: boolean;
};

export default function AnimalsContainer({ limit, random, pagination = true }: Props) {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [page, setPage] = useState(1);
  const animalsPerPage = limit || 3;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAnimal = await api.fetchAnimals(animalsPerPage, random);
        setAnimals(fetchedAnimal);
        setHasMore(fetchedAnimal.length === animalsPerPage);
      } catch (error) {
        logError("Erreur lors du chargement des animaux :", error);
      }
    };

    fetchData();
  }, [page, animalsPerPage, random]);

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <main>
        <div className="container mt-5 fade-in">
          <div className="d-flex justify-content-center mb-4">
            <h1 className="section-title">Les animaux</h1>
          </div>

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
                      <br />
                    </p>
                    <Link to={`/animals/${animal.id}`} className="btn btn-outline-primary mt-auto">
                      Voir détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={handlePrevious}
              disabled={page === 1}
            >
              Précédent
            </button>
            <span className="align-self-center">Page {page}</span>
            <button 
              className="btn btn-outline-secondary"
              onClick={handleNext}
              disabled={!hasMore}
            >
              Suivant
            </button>
          </div>

          )}
        </div>
      </main>
    </>
  );
}