import { IUserAnimal } from "../@types";

interface AnimalCardProps {
  animal: IUserAnimal;
  onEdit: (id: number) => void;
  onDelete: (animal: IUserAnimal) => void;
}

export default function AnimalsFromAsso({ animal, onEdit, onDelete }: AnimalCardProps) {
  const formattedDate = new Date(animal.birthday).toLocaleDateString("fr-FR");

  return (
    <div className="col-md-4 mb-4">
      <div className="card animal-card h-100 text-center shadow-sm hover-effect">
        {animal.picture && (
          <img
            src={animal.picture}
            alt={animal.name}
            className="card-img-top img-fluid rounded-top animal-img"
            loading="lazy"
          />
        )}

        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title fw-bold mb-2">{animal.name}</h5>
          <p className="card-text text-muted mb-3">{animal.description}</p>

          <div className="info-grid text-start mb-3">
            <p>
              <span className="fw-bold">Espèce :</span>{" "}
              {animal.species?.name || "Information non disponible"}
            </p>
            <p>
              <span className="fw-bold">Date de naissance :</span> {formattedDate}
            </p>
          </div>

          <div className="d-flex justify-content-between mt-auto">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onEdit(animal.id)}
              aria-label={`Modifier ${animal.name}`}
            >
              ✏️ Modifier
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(animal)}
              aria-label={`Supprimer ${animal.name}`}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}