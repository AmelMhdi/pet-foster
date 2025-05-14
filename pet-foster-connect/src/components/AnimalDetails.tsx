import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { IAnimal } from "../@types";
import { api } from '../services/api';
import { useUserStore } from "../store";

export default function AnimalDetails() {
  const user = useUserStore((state) => state.user);
  const { id } = useParams();
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // éviter de cliquer plusieurs fois sur le bouton "envoyer" pendant que le message est en cours d’envoi
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) {
      setErrorMessage("Le message ne peut pas être vide.");
      return;
    }

    if (!user) {
      setErrorMessage("Vous devez être connecté.e pour envoyer un message.");
      return;
    }

    if (!animal) {
      setErrorMessage("Informations sur l'animal non disponibles.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const response = await api.postUserMessageToApi(user.id, animal.id, trimmedMessage);
      
      if (!animal?.id) {
        setErrorMessage("Informations sur l'animal non disponibles.");
        return;
      }
      
      console.log("Message envoyé :", response);
      setNewMessage(""); 
      setSuccessMessage("Votre demande d'accueil a été envoyée avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setErrorMessage("Une erreur est survenue lors de l'envoi du message.");
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const parsedId = parseInt(id, 10);
        const newAnimal = await api.getAnimal(parsedId);
        setAnimal(newAnimal);

        if (user?.id) {
          try {
            const message = await api.getUserMessageFromApi(user.id, parsedId);
            if (message) {
              setNewMessage(message);
            }
          } catch (msgError) {
            console.error("Erreur lors du chargement du message :", msgError);
          }
        }         
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    loadData();
  }, [id, user]);

  if(isNaN(Number(id))) {
    return <Navigate to="/404" replace />;
  }

  if (!id) return <div className="alert alert-danger">Erreur : ID manquant.</div>;
  if (!animal) return <div className="alert alert-danger">Erreur : animal introuvable.</div>;

  return (
    <div className="container mt-5 fade-in">
      <div className="d-flex justify-content-center mb-4">
        <h1 className="mb-4 text-center">{animal.name}</h1>
      </div>

      <div className="row">
      {/* --- Partie Informations --- */}
      <div className="col-md-6 mb-3">
        <img src={animal?.picture} alt={animal?.name} className="img-fluid rounded" />
      </div>

        <div className="col-md-6">
          <div className="card info-card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3 fw-bold">Informations</h5>
              <div className="card-text info-text">
                <div><strong>Date de naissance :</strong> {new Date(animal.birthday).toLocaleDateString("fr-FR")}</div>
                <div><strong>Espèce :</strong> {animal.species?.name || "Information non disponible"}</div>
                <div><strong>Description :</strong> {animal.description}</div>
                <div><strong>Ville :</strong> {animal.localisation?.city || "Information non disponible"}</div>
              </div>
            </div>
          </div>

          {/* --- Partie Demande d'accueil --- */}
          <div className="card shadow-sm foster-request-card">
            <div className="card-body">
              <h5 className="card-title mb-3 fw-bold">Demande d'accueil</h5>

              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              <div className="mb-3">
                <label htmlFor="userMessageInput" className="form-label">
                  Votre message :
                </label>
                <textarea
                  id="userMessageInput"
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  placeholder="Expliquez pourquoi vous souhaitez accueillir cet animal..."
                />
              </div>

              <button
                className="btn btn-foster-request w-100"
                onClick={handleSubmit}
                disabled={isLoading || !user}
              >
                Envoyer mon message
              </button>

              {!user && (
                <div className="alert alert-warning mt-3">
                  Vous devez être connecté.e pour envoyer une demande d'accueil.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}