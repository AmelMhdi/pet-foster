import { IUserAnimal } from "../@types";

interface AnimalCardProps {
  animal: IUserAnimal;
  onEdit: (id: number) => void;
  onDelete: (animal: IUserAnimal) => void;
}

export default function AnimalsFromAsso({
  animal,
  onEdit,
  onDelete,
}: AnimalCardProps) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        {animal.picture && (
          <img
            src={animal.picture}
            alt={animal.name}
            className="card-img-top object-fit-cover"
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{animal.name}</h5>
          <p className="card-text">
            Date de naissance :{" "}
            <span className="fw-bold">
              {new Date(animal.birthday).toLocaleDateString("fr-FR")}
            </span>
          </p>
          <p className="card-text">
            Espèce : <span className="fw-bold">{animal.species.name}</span>
          </p>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onEdit(animal.id)}
            >
              Modifier
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(animal)}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
