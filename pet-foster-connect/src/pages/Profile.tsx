import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  getAnimalsByAssociationFromApi,
  getUserMessagesApi,
} from "../services/associationsApi";
import { IUserAnimal, IUserAnimalMessage } from "../@types/user-index";
import { deleteAnimalApi } from "../services/api";
import { deleteUserFromApi } from "../services/usersApi";

export default function Profile() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>("");
  const user = useUserStore((state) => state.user);
  const [animals, setAnimals] = useState<IUserAnimal[]>([]);
  const [messages, setMessages] = useState<IUserAnimalMessage[]>([]);
  const [animalToDelete, setAnimalToDelete] = useState<IUserAnimal | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);

  useEffect(() => {
    const loadAnimals = async () => {
      if (!user) return;
      try {
        const newAnimals = await getAnimalsByAssociationFromApi(user.id);
        setAnimals(newAnimals);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      }
    };
    loadAnimals();
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      try {
        const newMessages = await getUserMessagesApi(user.id);
        setMessages(newMessages);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      }
    };
    loadMessages();
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleDeleteAnimal = async (animalId: number) => {
    try {
      await deleteAnimalApi(animalId);
      setAnimals((prev) => prev.filter((animal) => animal.id !== animalId));
      setFeedback("Animal supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'animal", error);
      setFeedback(
        "Une erreur est survenue lors de la suppression de l'animal."
      );
    } finally {
      setShowDeleteModal(false);
      setAnimalToDelete(null);
    }
  };

  const handleDeleteProfil = async (userId: number) => {
    try {
      await deleteUserFromApi(userId);
      useUserStore.getState().logout();
      setFeedback("Profil supprimé avec succès !");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      setFeedback("Une erreur est survenue lors de la suppression.");
    } finally {
      setShowDeleteProfileModal(false);
    }
  };

  return (
    <div className="container my-4">
      {/* Section animaux */}

      <section className="my-5">
        <div className="d-flex flex-wrap gap-3">
          <Link className="btn btn-primary" to={`/modifier-profil/${user.id}`}>
            Modifier mon profil
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setShowDeleteProfileModal(true)}
          >
            Supprimer Mon profil
          </button>
          <Link className="btn btn-primary" to={`/creer-animal/${user.id}`}>
            Créer un animal
          </Link>
        </div>
      </section>

      {feedback && (
        <div className="alert alert-info text-center my-3" role="alert">
          {feedback}
        </div>
      )}

      <section id="animaux" className="mb-5">
        <h3 className="mb-4">Animaux proposés :</h3>

        {animals.length === 0 ? (
          <p className="text-muted">Aucun animal pour le moment.</p>
        ) : (
          <div className="row g-4">
            {animals.map((animal) => (
              <div key={animal.id} className="col-md-4">
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
                      Espèce :{" "}
                      <span className="fw-bold">{animal.species.name}</span>
                    </p>

                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          navigate(`/modifier-animal/${animal.id}`)
                        }
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setAnimalToDelete(animal);
                          setShowDeleteModal(true);
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="messages" className="mb-5">
        <h2 className="mb-4">Messages reçus</h2>
        {messages.length === 0 ? (
          <p className="text-muted">Aucun message pour le moment.</p>
        ) : (
          <div className="row g-3">
            {messages.map((message) => {
              //  pour creer une clé unique on associe famille et animal choisi
              return (
                <div
                  key={`${message.userId}-${message.animal}`}
                  className="col-md-6"
                >
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fs-3">
                        Message de {message.firstname} {message.name} reçu le{" "}
                        {message.createdAt} pour l'animal {message.animal}:
                      </h5>
                      <p className="card-text fs-5">{message.message}</p>
                      <p className="card-text fs-5">
                        email : <span className="fw-bold">{message.email}</span>
                      </p>
                      <p className="card-text fs-5">
                        téléphone :{" "}
                        <span className="fw-bold">{message.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* ✅ Modale de confirmation */}
      {animalToDelete && showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation de suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAnimalToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer l’animal{" "}
                  <strong>{animalToDelete.name}</strong> ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAnimalToDelete(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteAnimal(animalToDelete.id)} // Passer l'ID de l'animal ici
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteProfileModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation de suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteProfileModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer votre profil ? Cette action
                  est irréversible.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteProfileModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteProfil(user.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
