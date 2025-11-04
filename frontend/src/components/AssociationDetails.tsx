import { Navigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../services/userApi";
import { IAssociation } from "../@types";
import { logError } from "../helpers/logError";
import { fetchAssociationById } from "../services/api";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

export default function ContactAssociation() {
  const { id } = useParams();
  const [association, setAssociation] = useState<IAssociation>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return setNotFound(true);

      try {
        setLoading(true);
        const associationId = parseInt(id);
        const oneAssociation = await fetchAssociationById(associationId);

        if (oneAssociation && oneAssociation.role?.name === "Association") {
          setAssociation(oneAssociation as IAssociation);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        logError("Erreur lors du chargement :", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (isNaN(Number(id)) || notFound) return <Navigate to="/404" replace />;

  return (
    <div className="container my-4 fade-in">
      <div className="text-center mb-4">
        <h2 className="section-title">
          {association?.last_name} {association?.first_name}
        </h2>
        <p>
          Contactez-nous au{" "}
          <span className="fw-bold">{association?.phone_number}</span> ou par
          mail <span className="fw-bold">{association?.email}</span>
        </p>
        <p className="text-muted">
          📍 {association?.street_number} {association?.address},{" "}
          {association?.zip_code} {association?.city}
        </p>
        {association?.rna_number && (
          <p className="text-muted">N° RNA : {association.rna_number}</p>
        )}
      </div>

      <div>
        {association?.animals?.length ? (
          <>
            <h3 className="mb-4 text-center">Nos animaux</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {association.animals.map((animal) => (
                <div key={animal.id} className="col">
                  <div className="card animal-card h-100 text-center shadow-sm">
                    {animal.picture && (
                      <img
                        src={`${apiBaseUrl}/images/${animal.picture}.webp`}
                        alt={animal.name}
                        className="animal-img img-fluid rounded-top"
                        loading="lazy"
                      />
                    )}
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title fw-bold mb-2">{animal.name}</h5>
                      <Link to={`/animals/${animal.id}`} className="btn btn-outline-primary mt-auto" aria-label={`Voir les détails de ${animal.name}`}>
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h3 className="text-center text-muted">Pas d’animaux pour le moment.</h3>
        )}
      </div>
    </div>
  );
}