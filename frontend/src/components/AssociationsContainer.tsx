import { useEffect, useState } from "react";
import { IUser } from "../@types";
import { Link } from "react-router-dom";
import { logError } from "../helpers/logError";
import { fetchAssociations } from "../services/api";

export default function AssociationsContainer() {
  const [associations, setAssociations] = useState<IUser[]>([]);

  useEffect(() => {
    async function getAssociations() {
      try {
        const fetchedAssociations = await fetchAssociations();
        setAssociations(fetchedAssociations);
      } catch (error) {
        logError("Erreur lors de la récupération des associations :", error);
      }
    }
    getAssociations();
  }, []);

  return (
    <>
      <main>
        <div className="container mt-5">
          <div className="text-center mb-5">
            <h1 className="associations-title">Les associations</h1>
            <p className="associations-subtitle">Découvrez les organisations qui protègent nos animaux</p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {associations.map((association) => (
              <div key={association.id} className="col">
                <div className="association-card-wrapper h-100">
                  <div className="association-card h-100">
                    <div className="association-header">
                      <div className="association-name">
                        {association.last_name || "Nom inconnu"}
                      </div>

                      <div className="association-body">
                        <div className="association-info">
                          <div className="info-item">
                            <span className="info-label">Localité : </span>
                            <span className="info-value">{association.city || "Ville inconnue"}</span>
                          </div>

                          <div className="info-item">
                            <span className="info-label">Code postal : </span>
                            <span className="info-value">{association.zip_code || "Code postal inconnu"}</span>
                          </div>
                        </div>

                        <Link
                          to={`/associations/${association.id}`}
                          className="btn btn-details mt-auto"
                        >
                          Voir détails
                        </Link>
                      </div>
                    </div>
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