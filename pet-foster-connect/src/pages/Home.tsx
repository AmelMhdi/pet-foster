import { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer';
import { api } from '../services/api';

type Animal = {
  id: number;
  name: string;
  date_of_birth?: string;
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
        <MainContainer />

        <div className="container mt-5">
          <h2 className="mb-4 text-center">Nos animaux</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          
            {animals.map((animal) => (
              <div key={animal.id} className="col">
                <div className="card border-0 bg-transparent text-center">
                  <img 
                    src={animal.picture || "/images/chat.png"}
                    alt={animal.name}
                    className="card-img-top img-fluid rounded"
                  />

                  <div className="card-body">
                    <p className="card-text">
                      {animal.name}
                      <br />
                      Né le : {animal.date_of_birth || "Inconnu"}
                      <br />
                      Espèce : {animal.species.name || "Inconnue"}
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
