import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { IAnimal } from '../@types'; 

type Props = {
  limit?: number;
  random?: boolean;
};

export default function AnimalsContainer({ limit, random }: Props) {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [showAll, setShowAll] = useState(false); // state to manage the display of all animals

  useEffect(() => {
    api.fetchAnimals(limit, random)
    .then(setAnimals)
    .catch(err => console.error("Erreur:", err));
}, [limit, random]);


  return (
    <>
      <main>

        <div className="container mt-5 fade-in">
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
                    </p>
                    <Link 
                      to={`/animals/${animal.id}`} 
                      className="btn btn-outline-primary mt-auto">
                        Voir détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* button to see all animals */}
          {limit && (
            <div className="text-center mt-4">
            <Link to="/animals" className="btn btn-primary">
              Voir tous les animaux
            </Link>
          </div>
          )}

          {showAll && (
            <div className="text-center mt-4">
              <button className="btn btn-secondary" onClick={() => setShowAll(false)}>
                Réduire
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
