import { IUserAnimalMessage } from "../@types";

interface MessageCardProps {
  message: IUserAnimalMessage;
}

export default function MessagesForAsso({ message }: MessageCardProps) {
  return (
    <div className="col-md-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fs-3">
            Message de {message.firstname} {message.name} reçu le{" "}
            {new Date(message.createdAt).toLocaleDateString("fr-FR")} pour{" "}
            {message.animal} :
          </h5>
          <p className="card-text fs-5">{message.message}</p>
          <p className="card-text fs-5">
            email : <span className="fw-bold">{message.email}</span>
          </p>
          <p className="card-text fs-5">
            téléphone : <span className="fw-bold">{message.phone}</span>
          </p>
        </div>
      </div>
    </div>
  );
}