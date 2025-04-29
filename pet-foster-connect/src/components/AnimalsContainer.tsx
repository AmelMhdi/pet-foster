import { useEffect, useState } from 'react';
import { api } from '../services/api';

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
        console.log(fetchedAnimals) 
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
          <h1 className="mb-4 text-center">Nos animaux</h1>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          
            {animals.map((animal) => (
              <div key={animal.id} className="col">
                <div className="card border-0 bg-transparent text-center">
                  <img 
                    src={animal.picture}
                    alt={animal.name}
                    className="card-img-top img-fluid rounded"
                  />

                  <div className="card-body">
                    <p className="card-text">
                      {animal.name}
                      <br />
                      Ville : {animal.localisation.city || "Inconnue"}
                      <br />
                    </p>
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
