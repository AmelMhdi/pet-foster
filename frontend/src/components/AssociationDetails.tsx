import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAssociationById } from "../services/api";
import { IAssociationDetail } from "../@types";
import { logError } from "../helpers/logError";

export default function ContactAssociation() {
  const { id } = useParams();
  const [association, setAssociation] = useState<IAssociationDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        const associationId = parseInt(id);
        const oneAssociation = await fetchAssociationById(associationId);
        if (!oneAssociation) {
          setNotFound(true);
        } else {
          setAssociation(oneAssociation);
        }
      } catch (error) {
        logError("Erreur lors du chargement:", error);
        setNotFound(true);
      }
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (isNaN(Number(id)) || notFound) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <div className="container my-4">
        <div className="mb-4">
          <h2 className="section-title">{association?.lastname}</h2>
          <p className="text-center">
            Contactez-nous au <span className="fw-bold">{association?.phone_number}</span> ou par mail{" "}
            <span className="fw-bold">{association?.email}</span>
          </p>
        </div>
        <div>
          {association?.animals_asso?.length ? (
            <>
              <h3 className="mb-4">Nos animaux</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {association.animals_asso.map((animal) => (
                  <div key={animal.id} className="col-md-4">
                    <div className="card animal-card h-100 text-center shadow-sm">
                      {animal.picture && (
                        <img
                          src={animal.picture}
                          alt={animal.name}
                          className="animal-img card-img-top img-fluid rounded-top"
                          loading="lazy"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{animal.name}</h5>

                        <Link to={`/animals/${animal.id}`} className="btn btn-outline-primary mt-auto">
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