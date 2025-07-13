import { useEffect, useState } from "react";
import { api } from "../services/api";
import { IUser } from "../@types";
import { Link } from "react-router-dom";
import { logError } from "../helpers/logError";

export default function AssociationsContainer() {
  const [associations, setAssociations] = useState<IUser[]>([]);

  useEffect(() => {
    async function getAssociations() {
      try {
        const fetchedAssociations = await api.fetchAssociations();
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
          <div className="d-flex justify-content-center mb-4">
            <h1 className="section-title">Les associations</h1>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {associations.map((association) => (
              <div key={association.id} className="col">
                <div className="card card-body-standard border-0 bg-transparent text-center">
                  <div className="association-card h-100 text-center shadow-sm">
                    
                    <div className="association-text">
                      <div>{association.lastname}</div>
                      <div>{association.localisation?.postcode || "Code postal inconnu"}</div>
                      <div>{association.localisation?.city || "Ville inconnue"}</div>
                      <Link 
                        to={`/associations/${association.id}`} 
                        className="btn btn-outline-primary mt-auto"
                      >
                        Voir détails
                      </Link>
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