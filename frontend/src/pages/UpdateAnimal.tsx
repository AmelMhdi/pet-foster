import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store";
import { IAnimal, ISpecies } from "../@types";
import { getAnimalByIdFromApi, getSpeciesFromApi, updateAnimalFromApi } from "../services/animalApi";

export default function UpdateAnimal() {
  const { id } = useParams();
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [speciesList, setSpeciesList] = useState<ISpecies[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    description: "",
    picture: "",
    species_id: "" as number | "",
  });

  // --- Chargement initial de l'animal et des espèces ---
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const animalData = await getAnimalByIdFromApi(Number(id));
      if (!animalData) {
        setFeedback("Animal non trouvé.");
        return;
      }
      setAnimal(animalData);

      const species = await getSpeciesFromApi();
      setSpeciesList(species);

    // Initialisation du formulaire avec les noms de champs corrects
    setForm({
      name: animalData.name,
      date_of_birth: animalData.date_of_birth,
      description: animalData.description,
      picture: animalData.picture,
      species_id: animalData.species_id,
    });

    nameInputRef.current?.focus();
    };
    loadData();
  }, [id]);

  // --- Gestion des changements de formulaire ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "species_id" ? (value ? Number(value) : "") : value,
    }));
  };

  // --- Soumission du formulaire ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !id) {
      alert("Erreur d'authentification ou d'identifiant d'animal.");
      return;
    }

    // Validation de base pour les champs requis
    if (!form.name || !form.date_of_birth || !form.description || !form.picture || !form.species_id) {
      setFeedback("Veuillez remplir tous les champs obligatoires (nom, date de naissance, description, espèce).");
      return;
    }

    // Construction de l'objet animal mis à jour
    const updatedAnimalData: Partial<IAnimal> = {
      id: Number(id),
      name: form.name,
      date_of_birth: form.date_of_birth,
      description: form.description,
      picture: form.picture,
      species_id: form.species_id,
      user_id: user.id,
    };

    setFeedback("Mise à jour en cours...");
    setIsSending(true);

    try {
      const res = await updateAnimalFromApi(Number(id), updatedAnimalData);

      if (res) {
        setFeedback("Animal mis à jour avec succès !");
        setTimeout(() => {
          navigate(`/profil-association/${user.id}`);
        }, 1000);
      } else {
        setFeedback("Erreur lors de la mise à jour de l'animal.");
      }
    } catch (error) {
      console.log("Erreur lors de la mise à jour de l'animal :", error);
      setFeedback("Une erreur est survenue lors de la mise à jour de l'animal.");
    } finally {
      setIsSending(false);
    }
  };

  if (!animal) return <p>Chargement...</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Modifier l’animal : {animal.name}</h1>
      {feedback && <div className="alert alert-info text-center my-3">{feedback}</div>}
      <form onSubmit={handleSubmit}>

        {/* Nom */}
        <label className="form-label h4" htmlFor="name">Nom</label>
        <input
          ref={nameInputRef}
          className="form-control mb-3"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        {/* Date de naissance */}
        <label className="form-label h4" htmlFor="date_of_birth">Date de naissance</label>
        <input
          className="form-control mb-3"
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={form.date_of_birth}
          onChange={handleChange}
        />

        {/* Description */}
        <label className="form-label h4" htmlFor="description">Description</label>
        <textarea
          className="form-control mb-3"
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        {/* Picture */}
        <label className="form-label h4" htmlFor="picture">Image (URL)</label>
        <input
          className="form-control mb-3"
          id="picture"
          name="picture"
          value={form.picture}
          onChange={handleChange}
        />

        {/* Espèce */}
        <label className="form-label h4" htmlFor="species_id">Espèce</label>
        <select
          id="species_id"
          name="species_id"
          className="form-control mb-3"
          value={form.species_id}
          onChange={handleChange}
        >
          <option value="">-- Choisir une espèce --</option>
          {speciesList.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          type="submit"
          className="btn btn-success d-block mx-auto"
          value="Mettre à jour"
          disabled={isSending}
        />
      </form>
    </div>
  );
}
