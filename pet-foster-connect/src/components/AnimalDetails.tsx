import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IAnimal } from "../@types";
import { api } from '../services/api';
import { useUserStore } from "../store";

export default function AnimalDetails() {
  const user = useUserStore((state) => state.user);
  const { id } = useParams();
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    console.log("Message à envoyer :", trimmedMessage);

    if (!trimmedMessage) {
      alert("Le message ne peut pas être vide.");
      return
    }

    if (user && animal) {
      const message = await api.postUserMessageToApi(user.id, animal.id, trimmedMessage);
      console.log("Message envoyé :", message);
      setNewMessage("");
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;
  
        const parsedId = parseInt(id, 10);
        const newAnimal = await api.getAnimal(parsedId);
        setAnimal(newAnimal);
        
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
  
    loadData();
  }, [id]);
  

// en cas d'erreur 404 :
// créer <Navigate to="/404" replace />;
if (!id) return <div>Erreur : ID manquant.</div>;
if (!animal) return <div>Chargement...</div>;

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
              <div>
                <span className="fw-bold">Date de naissance :</span> {new Date(animal.birthday).toLocaleDateString("fr-FR")}
              </div>
              <div>
                <span className="fw-bold">Espèce :</span> {animal.species?.name || "Information non disponible"}
              </div>
              <div>
                <span className="fw-bold">Description :</span> {animal.description}
              </div>
              <div>
                <span className="fw-bold">Ville :</span> {animal.localisation?.city || "Information non disponible"}
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="userMessageInput" className="form-label">
                Votre message :
              </label>
              <textarea
                id="userMessageInput"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                className="btn btn-primary mt-4 foster-request-btn" 
                onClick={handleSendMessage}
              >
                Faire une demande d'accueil
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);
}