import { Navigate,useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAssociationById } from '../services/api';
import { IAssociationDetail } from '../@types';

export default function ContactAssociation() {
  const { id } = useParams();
  const [association, setAssociation] = useState<IAssociationDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
  
      const associationId = parseInt(id);
      if (isNaN(associationId)) {
        setNotFound(true);
        setLoading(false);
        return;
      }
  
      try {
        const oneAssociation = await fetchAssociationById(associationId);
        if (!oneAssociation) {
          setNotFound(true);
        } else {
          setAssociation(oneAssociation);
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [id]);
  
  if(isNaN(Number(id))) {
    return <Navigate to="/404" replace />;
  }

  if (notFound) {
  return <Navigate to="/404" replace />;
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!association) return <p>Erreur : association non trouvée.</p>;

  return (
    <>
      <div className="container my-4">
        <div className="mb-4">
          <h2 className="text-center">{association?.lastname}</h2>
            <p className="text-center">
              Contactez-nous au <span className="fw-bold">{association?.phone_number}</span>{' '}
              ou par mail <span className="fw-bold">{association?.email}</span>
            </p>
        </div>
        <div>
          {association?.animals_asso?.length ? (
            <>
              <h3 className="mb-4">Nos animaux</h3>
              <div className="row g-4">
                {association.animals_asso.map((animal) => (
                  <div key={animal.id} className="col-md-4">
                    <div className="card animal-card h-100 text-center shadow-sm">
                      {animal.picture && (
                        <img
                          src={animal.picture}
                          alt={animal.name}
                          className="card-img-top object-fit-cover"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{animal.name}</h5>
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
            </>
          ) : (
            <h3 className="text-muted">Pas d’animaux pour le moment.</h3>
          )}
        </div>
      </div>
    </>
  );
}