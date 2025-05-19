import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store";
import { getLocalisationsFromApi } from "../services/usersApi";
import { api, getAnimal } from "../services/api";
import { IAnimal, ILocalisation, ISpecies } from "../@types";

export default function UpdateAnimal() {
  const { id } = useParams();
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [speciesList, setSpeciesList] = useState<ISpecies[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    birthday: "",
    description: "",
    picture: "",
    postcode: "" as number | "",
    city: "",
    speciesId: "" as number | "",
  });

  useEffect(() => {
    const loadAnimal = async () => {
      if (id) {
        const animalData = await getAnimal(Number(id));
        setAnimal(animalData);
      }
    };
    loadAnimal();
  }, [id]);

  useEffect(() => {
    if (!animal) return;

    nameInputRef.current?.focus();

    const fetchData = async () => {
      const [locs, species] = await Promise.all([
        getLocalisationsFromApi(),
        api.getSpeciesFromApi(),
      ]);
      setLocalisations(locs);
      setSpeciesList(species);

      if (id) {
        const animal = await api.getAnimal(Number(id));
        if (animal) {
          const localisation = locs.find((loc: ILocalisation) => loc.id === animal.localisation_id);
          setForm({
            name: animal.name,
            birthday: animal.birthday,
            description: animal.description,
            picture: animal.picture,
            postcode: localisation?.postcode ?? "",
            city: localisation?.city ?? "",
            speciesId: animal.species_id,
          });
        } else {
          setFeedback("Animal non trouvé.");
        }
      }
    };

    fetchData();
  }, [id, animal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "postcode" || name === "speciesId" ? (value ? Number(value) : "") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Utilisateur non authentifié.");
      return;
    }

    const selectedLoc = localisations.find(
      (loc) => loc.city === form.city && loc.postcode === form.postcode
    );

    if (!selectedLoc || !form.name || !form.birthday || !form.description || !form.picture || !form.speciesId) {
      setFeedback("Veuillez remplir tous les champs.");
      return;
    }

    const updatedAnimal: IAnimal = {
      id: Number(id),
      name: form.name,
      birthday: form.birthday,
      description: form.description,
      picture: form.picture,
      localisation_id: selectedLoc.id,
      species_id: form.speciesId,
      user_id: user.id,
    };

    setFeedback("Mise à jour en cours...");
    setIsSending(true);

    const res = await api.updateAnimalFromApi(updatedAnimal, user.token);
    if (res) {
      setFeedback("Animal mis à jour avec succès !");
      setTimeout(() => {
        navigate(`/profil-association/${user.id}`);
      }, 1000);
    } else {
      setFeedback("Erreur lors de la mise à jour.");
    }
    setIsSending(false);
  };

  const cities = Array.from(new Set(localisations.map((l) => l.city)));
  const postcodes = Array.from(new Set(localisations.map((l) => l.postcode)));

  if (!animal) return <p>Chargement...</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Modifier l’animal</h1>
      {feedback && <div className="alert alert-info text-center my-3">{feedback}</div>}
      <form onSubmit={handleSubmit}>
        <label className="form-label h4" htmlFor="name">Nom</label>
        <input
          ref={nameInputRef}
          className="form-control mb-3"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label className="form-label h4" htmlFor="birthday">Date de naissance</label>
        <input
          className="form-control mb-3"
          id="birthday"
          name="birthday"
          type="date"
          value={form.birthday.slice(0, 10)}
          onChange={handleChange}
        />

        <label className="form-label h4" htmlFor="description">Description</label>
        <textarea
          className="form-control mb-3"
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label className="form-label h4" htmlFor="picture">Image (URL)</label>
        <input
          className="form-control mb-3"
          id="picture"
          name="picture"
          value={form.picture}
          onChange={handleChange}
        />

        <label className="form-label h4" htmlFor="postcode">Code Postal</label>
        <select
          id="postcode"
          name="postcode"
          className="form-control mb-3"
          value={form.postcode}
          onChange={handleChange}
        >
          <option value="">-- Choisir un code postal --</option>
          {postcodes.map((pc, i) => (
            <option key={i} value={pc}>{pc}</option>
          ))}
        </select>

        <label className="form-label h4" htmlFor="city">Ville</label>
        <select
          id="city"
          name="city"
          className="form-control mb-3"
          value={form.city}
          onChange={handleChange}
        >
          <option value="">-- Choisir une ville --</option>
          {cities.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <label className="form-label h4" htmlFor="speciesId">Espèce</label>
        <select
          id="speciesId"
          name="speciesId"
          className="form-control mb-3"
          value={form.speciesId}
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
