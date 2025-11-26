import { Navigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAssociation } from "../@types";
import { logError } from "../helpers/logError";
import { fetchAssociationById } from "../services/api";
import "../styles/association.css";

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
    <div className="container my-5 fade-in">
      <div className="association-header mb-5 pb-4">
        <h1 className="association-title">
          {association?.last_name}
        </h1>
        <div className="association-info-section">
          <div className="info-card">
            <p className="info-label">Téléphone</p>
            <p className="info-value">{association?.phone_number}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Email</p>
            <p className="info-value">{association?.email}</p>
          </div>
        </div>

        <div className="address-section">
          <p className="address-title">Adresse</p>
          <p className="address-text">
            {association?.street_number} {association?.address}
          </p>
          <p className="address-text">
            {association?.zip_code} {association?.city}
          </p>
        </div>

        {association?.rna_number && (
          <div className="rna-section">
            <p className="rna-label">N° RNA :</p>
            <p className="rna-value">{association.rna_number}</p>
          </div>
        )}
      </div>

      <div className="animals-section">
        {association?.animals?.length ? (
          <>
            <h2 className="animals-section-title">Animaux de l&apos;association</h2>
            <div className="animals-grid">
              {association.animals.map((animal) => (
                <div key={animal.id} className="animal-card-wrapper">
                  <div className="animal-card-details">
                    {animal.picture && (
                      <img
                        src={`${apiBaseUrl}/images/${animal.picture}.webp`}
                        alt={animal.name}
                        className="animal-img-details"
                        loading="lazy"
                      />
                    )}
                    <div className="animal-card-content">
                      <h5 className="animal-name-details">{animal.name}</h5>
                      <Link to={`/animaux/${animal.id}`} className="btn btn-primary btn-details" aria-label={`Voir les détails de ${animal.name}`}>
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-animals">
            <h3>Pas d&apos;animaux pour le moment.</h3>
          </div>
        )}
      </div>
    </div>
  );
}