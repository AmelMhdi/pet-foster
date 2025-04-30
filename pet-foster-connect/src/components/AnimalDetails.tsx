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

  // créer <Navigate to="/404" replace />;
  if (!id) {
    return <div>Erreur : l'identifiant de l'animal est manquant.</div>;
  }

return (
  <div className="container mt-5">
    <div className="d-flex justify-content-center mb-4">
      <h1 className="mb-4 text-center">{animal.name}</h1>
    </div>

    <div className="row">
      <div className="col-md-6">
        <img src={animal?.picture} alt={animal?.name} className="img-fluid rouded" />
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Informations</h5>
            <p className="card-text">
              <strong>Date de naissance :</strong>
              {new Date(animal.birthday).toLocaleDateString()} 
              <br /> 
              <strong>Description :</strong>{animal.description} 
              <br /> 
              <strong>Ville :</strong>{animal.localisation?.city || "Inconnue"}
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
);
}