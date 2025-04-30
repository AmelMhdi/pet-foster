import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

type Animal = {
  id: number;
  name: string;
  birthday?: string;
  description?: string;
  picture?: string;
  species: {
    id: number;
    name: string;
  };
  localisation: {
    id: number;
    city: string;
    postcode: number;
  };
};

export default function AnimalsContainer() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    async function getAnimals() {
      try {
        const fetchedAnimals = await api.fetchAnimals();
        setAnimals(fetchedAnimals);
      } catch (error) {
        console.error("Erreur lors de la récupération des animaux :", error);
      }
    }
    getAnimals();
  }, []);

  return (
    <>
      <main>

        <div className="container mt-5">
          <div className='d-flex justify-content-center mb-4'>
            <h1 className="mb-4 text-center">Nos animaux</h1>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          
            {animals.map((animal) => (
              <div key={animal.id} className="col">
                <div className="card animal-card h-100 text-center shadow-sm">
                  <img 
                    src={animal.picture}
                    alt={animal.name}
                    className="card-img-top img-fluid rounded-top"
                  />

                  <div className="card-body d-flex flex-column justify-content-between">
                    <p className="card-text mb-3">
                      <strong>{animal.name}</strong>
                      <br />
                      {/* <span>Ville : {animal.localisation.city || "Inconnue"}</span> */}
                    </p>
                    <Link to={`/animals/${animal.id}`} className="btn btn-outline-primary mt-auto">
                      Voir détails
                    </Link>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
    </>
  );
}
