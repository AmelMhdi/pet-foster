import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IAnimal } from "../@types";
import { api } from '../services/api';

export default function AnimalDetails() {
  const { id } = useParams();
  const [animal, setAnimal] = useState<IAnimal | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const newAnimal = await api.getAnimal(Number.parseInt(id));
          console.log(newAnimal);
          setAnimal(newAnimal);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'animal :", error);
      }
    };
    loadData();
  }, [id]);

  // en cas d'erreur 404 :
  // créer <Navigate to="/404" replace />;
  if (!id) {
    return <div>Erreur : l'identifiant de l'animal est manquant.</div>;
  }
  if (!animal) {
  return <div>Chargement des informations de l'animal...</div>;
  }

return (
  <div className="container mt-5 fade-in">
    <div className="d-flex justify-content-center mb-4">
      <h1 className="mb-4 text-center">{animal.name}</h1>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <img src={animal?.picture} alt={animal?.name} className="img-fluid rounded" />
      </div>

      <div className="col-md-6">
        <div className="card info-card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3 fw-bold">Informations</h5>
            <div className="card-text info-text">
              <div><span className="fw-bold">Date de naissance :</span> {new Date(animal.birthday).toLocaleDateString("fr-FR")}</div>
              <div><span className="fw-bold">Espèce :</span> {animal.species.name}</div>
              <div><span className="fw-bold">Description :</span> {animal.description}</div>
              <div><span className="fw-bold">Ville :</span> {animal.localisation.city}</div>
            </div>
            <button className="btn btn-primary mt-4 foster-request-btn">Faire une demande d'accueil</button>
          </div>
        </div>
      </div>

    </div>
  </div>
);
}