import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  getAnimalsByAssociationFromApi,
  getUserMessagesApi,
} from "../services/associationsApi";
import { deleteAnimalApi } from "../services/api";
import { deleteUserFromApi } from "../services/usersApi";
import DeleteAnimalModal from "../components/DeleteAnimalModal";
import DeleteProfileModal from "../components/DeleteProfilModal";
import AnimalsFromAsso from "../components/AnimalsFromAsso";
import MessagesForAsso from "../components/MessagesForAsso";
import { IUserAnimal, IUserAnimalMessage } from "../@types";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  const [animals, setAnimals] = useState<IUserAnimal[]>([]);
  const [messages, setMessages] = useState<IUserAnimalMessage[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  const [animalToDelete, setAnimalToDelete] = useState<IUserAnimal | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);

  const userId = Number(id);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [fetchedAnimals, fetchedMessages] = await Promise.all([
          getAnimalsByAssociationFromApi(userId), 
          getUserMessagesApi(userId)
        ]);
        setAnimals(fetchedAnimals);
        setMessages(fetchedMessages);
      } catch (error) {
        logError("Erreur lors du chargement", error);
        setFeedback("Une erreur est survenue lors du chargement.");
      }
    };
    loadData();
  }, [user])

  const handleDeleteAnimal = async (animalId: number) => {
    try {
      await deleteAnimalApi(animalId);
      setAnimals((prev) => prev.filter((animal) => animal.id !== animalId));
      setFeedback("Animal supprimé avec succès !");
    } catch (error) {
      logError("Erreur lors de la suppression de l'animal", error);
      setFeedback(
        "Une erreur est survenue lors de la suppression de l'animal.")
    } finally {
      setShowDeleteModal(false);
      setAnimalToDelete(null);
    }
  };

  const handleDeleteProfile = async (userId: number) => {
    try {
      await deleteUserFromApi(userId);
      useUserStore.getState().Logout();
      navigate("/");
    } catch (error) {
      logError("Erreur lors de la suppression", error);
      setFeedback("Une erreur est survenue lors de la suppression.");
    } finally {
      setShowDeleteProfileModal(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container my-4">
      <section className="my-5">
        <div className="d-flex flex-wrap gap-3">
          <Link className="btn btn-primary" to={`/modifier-profil/${user.id}`}>
            Modifier mon profil
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setShowDeleteProfileModal(true)}
          >
            Supprimer mon profil
          </button>
          <Link className="btn btn-primary" to={`/creer-animal/${user.id}`}>
            Ajouter un animal
          </Link>
        </div>
      </section>

      {feedback && (
        <div 
          className="alert alert-info text-center my-3" 
          role="alert" 
          aria-live="polite"
        >
          {feedback}
        </div>
      )}

      <section id="animaux" className="mb-5">
        <h3 className="mb-4">Animaux proposés</h3>

        {animals.length === 0 ? (
          <p className="text-muted">Aucun animal pour le moment.</p>
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
        <h2 className="mb-4">Messages reçus</h2>
        {messages.length === 0 ? (
          <p className="text-muted">Aucun message pour le moment.</p>
        ) : (
          <div className="row g-3">
            {messages.map((message) => (
              <MessagesForAsso
                key={`${message.userId}-${message.animal}`}
                message={message}
              />
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
          onConfirm={() => handleDeleteProfile(user.id)}
        />
      )}
    </div>
  );
}
