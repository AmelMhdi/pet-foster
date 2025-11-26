import { IAnimal } from "../@types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

interface AnimalCardProps {
  animal: IAnimal;
  onEdit: (id: number) => void;
  onDelete: (animal: IAnimal) => void;
}

export default function AnimalsFromAsso({ animal, onEdit, onDelete }: AnimalCardProps) {
  const formattedDate = new Date(animal.date_of_birth).toLocaleDateString("fr-FR");

  return (
    <div className="col-md-4 mb-4">
      <div className="card animal-card h-100 text-center shadow-sm">
        {animal.picture && (
          <img
            src={`${apiBaseUrl}/images/${animal.picture}.webp`}
            alt={animal.name}
            className="card-img-top img-fluid rounded-top animal-img"
            loading="lazy"
          />
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold mb-2">{animal.name}</h5>
          <p className="card-text mb-3">{animal.description}</p>

          <div className="text-start mb-3">
            <p className="mb-1">
              <strong>Espèce :</strong> {animal.species?.name || "Information non disponible"}
            </p>
            <p className="mb-0">
              <strong>Date de naissance :</strong> {formattedDate}
            </p>
          </div>

          <div className="d-flex justify-content-between mt-auto pt-3">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onEdit(animal.id)}
              aria-label={`Modifier ${animal.name}`}
            >
              Modifier
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(animal)}
              aria-label={`Supprimer ${animal.name}`}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}