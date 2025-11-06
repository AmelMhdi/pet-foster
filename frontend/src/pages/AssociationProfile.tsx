import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { deleteUserFromApi } from "../services/userApi";
import DeleteAnimalModal from "../components/DeleteAnimalModal";
import AnimalsFromAsso from "../components/AnimalsFromAsso";
import MessagesForAsso from "../components/MessagesForAsso";
import { IAnimal, IUserAnimalMessage } from "../@types";
import { logError } from "../helpers/logError";
import { deleteAnimalFromApi, getAnimalsByUserIdFromApi } from "../services/animalApi";
import { getMessageForAssociationFromApi } from "../services/api";
import DeleteProfileModal from "../components/DeleteProfilModal";

export default function Profile() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>("");
  const user = useUserStore((state) => state.user);
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [messages, setMessages] = useState<IUserAnimalMessage[]>([]);
  const [animalToDelete, setAnimalToDelete] = useState<IAnimal | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const validateId = () => {
      if (!id || isNaN(Number(id)) || Number(id) <= 0) {
        navigate("/404", { replace: true });
      } else if (user && Number(id) !== user.id) {
        navigate("/404", { replace: true });
      }
    };

    validateId();
  }, [id, user, navigate]);

  useEffect(() => {
    const loadAnimals = async () => {
      if (!user) return;
      try {
        const newAnimals = await getAnimalsByUserIdFromApi(user.id);
        setAnimals(newAnimals);
      } catch (error) {
        logError("Erreur lors du chargement des animaux", error);
      }
    };
    loadAnimals();
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      try {
        const newMessages = await getMessageForAssociationFromApi(user.id);
        setMessages(newMessages);
      } catch (error) {
        logError("Erreur lors du chargement des messages", error);
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
      await deleteAnimalFromApi(animalId);
      setAnimals((prev) => prev.filter((animal) => animal.id !== animalId));
      setFeedback("Animal supprimé avec succès !");
    } catch (error) {
      logError("Erreur lors de la suppression de l'animal", error);
      setFeedback("Une erreur est survenue lors de la suppression de l'animal.");
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
      logError("Erreur lors de la suppression du profil", error);
      setFeedback("Une erreur est survenue lors de la suppression du profil.");
    } finally {
      setShowDeleteProfileModal(false);
    }
  };

  return (
    <div className="container my-4">
      <section className="my-5">
        <div className="d-flex flex-wrap gap-3">
          <Link className="btn btn-primary" to={`/modifier-profil/${user.id}`}>
            Modifier mon profil
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteProfileModal(true)}>
            Supprimer mon profil
          </button>
          <Link className="btn btn-primary" to={`/creer-animal/${user.id}`}>
            Ajouter un animal
          </Link>
        </div>
      </section>

      {feedback && (
        <div className="alert alert-info text-center my-3" role="alert">
          {feedback}
        </div>
      )}

      <section id="animaux" className="mb-5">
        <h2 className="mb-4">Animaux en attente d'un foyer</h2>

        {animals.length === 0 ? (
          <p className="text-muted">Aucun animal pour le moment</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {animals.map((animal) => (
              <AnimalsFromAsso
                key={animal.id}
                animal={animal}
                onEdit={(id) => navigate(`/modifier-animal/${id}`)}
                onDelete={(animal) => {
                  setAnimalToDelete(animal);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section id="messages" className="mb-5">
        <h4 className="mb-4">Messages reçus</h4>
        {messages.length === 0 ? (
          <p className="text-muted">Aucun message pour le moment.</p>
        ) : (
          <div className="row g-3">
            {messages.map((message) => (
              <MessagesForAsso key={`${message.userId}-${message.animal}`} message={message} />
            ))}
          </div>
        )}
      </section>
      {animalToDelete && showDeleteModal && (
        <DeleteAnimalModal
          animalName={animalToDelete.name}
          onCancel={() => {
            setShowDeleteModal(false);
            setAnimalToDelete(null);
          }}
          onConfirm={() => handleDeleteAnimal(animalToDelete.id)}
        />
      )}

      {showDeleteProfileModal && (
        <DeleteProfileModal
          onCancel={() => setShowDeleteProfileModal(false)}
          onConfirm={() => handleDeleteProfil(user.id)}
        />
      )}
    </div>
  );
}