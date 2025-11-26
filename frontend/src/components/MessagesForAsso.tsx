import { IUserAnimalMessage } from "../@types";

interface MessageCardProps {
  message: IUserAnimalMessage;
}

export default function MessagesForAsso({ message }: MessageCardProps) {
  return (
    <div className="col-md-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="card-title card-title-details fs-3">
            {message.first_name} {message.last_name} a envoyé un message pour {message.animal.name}
          </p>
          <p className="card-text fs-5">{message.message}</p>
          <p className="card-text fs-5">
            E-mail : <span className="fw-bold">{message.email}</span>
          </p>
          <p className="card-text fs-5">
            Téléphone : <span className="fw-bold">{message.phone_number}</span>
          </p>
        </div>
      </div>
    </div>
  );
}