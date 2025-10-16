import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { IAnimal } from "../@types";
import { useUserStore } from "../store";
import { logError } from "../helpers/logError";
import { getAnimalByIdFromApi } from "../services/animalApi";
import { postUserMessageToApi } from "../services/api";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

export default function AnimalDetails() {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        const animalId = parseInt(id, 10);
        const fetchedAnimal = await getAnimalByIdFromApi(animalId);
        if (!fetchedAnimal) {
          setNotFound(true);
        } else {
          setAnimal(fetchedAnimal);
        }
      } catch (error) {
        logError("Erreur lors du chargement de l'animal :", error);
        setNotFound(true);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  }

  if (isNaN(Number(id)) || notFound) {
    return <Navigate to="/404" replace />;
  }

  if (!animal) {
    return <p>Aucun animal trouvé.</p>;
  }

  const handleSubmit = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !user || !animal) {
      setNotFound(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await postUserMessageToApi(animal.id, trimmedMessage);
      setNewMessage("");
      setSuccessMessage("Votre demande d'accueil a été envoyée avec succès.");
      setErrorMessage("");
    } catch (error) {
      logError("Erreur lors de l'envoi du message :", error);
      setErrorMessage("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="d-flex justify-content-center mb-4">
        <h1 className="section-title">{animal.name}</h1>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <img
            src={`${apiBaseUrl}/images/${animal.picture}.webp`}
            alt={animal.name}
            className="card-img-top img-fluid rounded-top"
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>

        <div className="col-md-6 mb-4">
          <div className="card-base card info-card shadow-sm mb-4">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title card-title-details mb-3 fw-bold">Informations</h5>
              <div className="info-text">
                <div className="info-grid">
                  <div >
                    <strong>Date de naissance :</strong> {new Date(animal.date_of_birth).toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <strong>Espèce :</strong> {animal.species?.name || "Information non disponible"}
                  </div>
                  <div>
                    <strong>Description :</strong> {animal.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-base card shadow-sm foster-request-card">
            <div className="card-body">
              <h5 className="card-title card-title-details mb-3 fw-bold">Demande d'accueil</h5>

              {!user ? (
                <div className="alert alert-warning">
                  Vous devez être connecté pour envoyer une demande d'accueil.{" "}
                </div>
              ) : (
                <>
                  {successMessage && <div className="alert alert-success" aria-live="polite">{successMessage}</div>}
                  {errorMessage && <div className="alert alert-danger" aria-live="polite">{errorMessage}</div>}
                  <div className="mb-3">
                    <label htmlFor="userMessageInput" className="form-label">
                      Expliquez pourquoi vous souhaitez accueillir cet animal.
                    </label>
                    <textarea
                      id="userMessageInput"
                      className="form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <button 
                    className="btn btn-foster-request w-100" 
                    onClick={handleSubmit} 
                    disabled={!newMessage.trim() || isSubmitting}
                    aria-label="Envoyer la demande d'accueil"
                  >
                    Envoyer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}