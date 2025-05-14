import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { IUser } from '../@types'
import { Link } from 'react-router-dom';


export default function AssociationsContainer() {
  const [associations, setAssociations] = useState<IUser[]>([]);

  useEffect(() => {
    async function getAssocations() {
      try {
        const fetchedAssociations = await api.fetchAssociations();
        setAssociations(fetchedAssociations);
      } catch (error) {
        console.error("Erreur lors de la récupération des associations :", error);
      }
    }
    getAssocations();
  }, []);

  return (
    <>
      <main>

        <div className="container mt-5">
          <div className='d-flex justify-content-center mb-4'>
            <h1 className="mb-4 text-center">Les Associations</h1>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          
            {associations.map((association) => (
              <div key={association.id} className="col">
                <div className="card border-0 bg-transparent text-center">

                  <div className="association-card h-100 text-center shadow-sm">
                    <p className="association-text">
                    <p>{association.firstname} {association.lastname}</p>
                    <p> {association.localisation.postcode} {association.localisation.city} </p>
                    <Link to={`/associations/${association.id}`}
                    className="btn btn-outline-primary mt-auto">
                        Voir détails
                      </Link>
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