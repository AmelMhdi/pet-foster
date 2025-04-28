import { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer';
import { api } from '../services/api';

type Animal = {
  id: number;
  name: string;
  date_of_birth?: number;
  description?: string;
  picture?: string;
}

export default function AnimalsContainer() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    async function getAnimals() {
      try {
        const fetchedAnimals = await api.fetchAnimals();
        setAnimals(fetchedAnimals)
      } catch (error) {
        console.error("Erreur lors de la récupération des animaux :", error);
      }
    }
  }, []);

  return (
    <>
      <main>
      <MainContainer />

        <div className="container mt-5">
          <h2 className="mb-4 text-center">Nos animaux</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">

            <div className="col">
              <div className="card border-0 bg-transparent text-center">
              
                <img src="/images/chat.png" className="card-img-top img-fluid rounded" alt="Chat" />
                <div className="card-body">
                  <p className="card-text">
                  <strong>Minou</strong>
                  <br />
                  Paris
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}