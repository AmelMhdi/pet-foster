import { useUserStore } from "../store";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { getLocalisationsFromApi } from "../services/userApi";
import { api, createAnimalFromApi } from "../services/api";
import { animalFormSchema } from "../validators/animal.shema";
import { ILocalisation, INewAnimal, ISpecies } from "../@types";

export default function CreateAnimal() {
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const user = useUserStore((state) => state.user);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [postcode, setPostcode] = useState<number | "">("");
  const [city, setCity] = useState<string>("");
  const [speciesList, setSpeciesList] = useState<ISpecies[]>([]);
  const [speciesId, setSpeciesId] = useState<number | "">("");

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleRegister = async (animalData: INewAnimal) => {
    setFeedback("Création de l'animal en cours...");
    setIsSending(true);

    await new Promise((res) => setTimeout(res, 1000));
    const response = await createAnimalFromApi(animalData);

    if ("error" in response) {
      setFeedback(response.error);
      setIsSending(false);
      return;
    }

    setFeedback("Animal créé avec succès !");
    setIsSending(false);
    setTimeout(() => {
      if (user) navigate(`/profil-association/${user.id}`);
    }, 1000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setFeedback("Vous devez être connecté pour créer un animal.");
      return;
    }
    const selectedLocalisation = localisations.find((loc) => loc.city === city && loc.postcode === postcode);

    if (!selectedLocalisation) {
      setFeedback("Localisation invalide.");
      return;
    }
    const newAnimal: INewAnimal = {
      name,
      birthday,
      description,
      picture,
      localisation_id: selectedLocalisation.id,
      species_id: speciesId as number,
    };

    const { error } = animalFormSchema.validate(
      {
        ...newAnimal,
        birthday: new Date(birthday), // converti en Date juste pour Joi
      },
      {
        abortEarly: true,
      }
    );

    if (error) {
      setFeedback(error.details[0].message);
      return;
    }

    await handleRegister(newAnimal);
  };

  useEffect(() => {
    const loadData = async () => {
      const localisationsData: ILocalisation[] = await getLocalisationsFromApi();
      const species = await api.getSpeciesFromApi();
      setLocalisations(localisationsData);
      setSpeciesList(species);
    };
    loadData();
  }, []);

  const cities = Array.from(new Set(localisations.map((loc) => loc.city)));
  const postcodes = Array.from(new Set(localisations.map((loc) => loc.postcode)));

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Ajouter un animal</h1>
      {feedback && (
        <div className="alert alert-info text-center my-3" role="alert">
          {feedback}
        </div>
      )}
      <form method="post" onSubmit={handleSubmit}>
        <div>
          <label className="form-label h4" htmlFor="name">
            Nom
          </label>
          <input
            className="form-control border border-secondary mb-4"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="form-label h4" htmlFor="birthday">
            Date de naissance
          </label>
          <input
            className="form-control border border-secondary mb-4"
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />

          <label className="form-label h4" htmlFor="description">
            Description
          </label>
          <textarea
            className="form-control border border-secondary mb-4"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="form-label h4" htmlFor="picture">
            Image (URL)
          </label>
          <input
            className="form-control border border-secondary mb-4"
            type="text"
            id="picture"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />

          <label className="form-label h4" htmlFor="postcode">
            Code postal
          </label>
          <select
            id="postcode"
            className="form-control border border-secondary mb-4"
            value={postcode}
            onChange={(e) => setPostcode(Number(e.target.value))}
          >
            <option value="">-- Choisir un code postal --</option>
            {postcodes.map((pc, index) => (
              <option key={index} value={pc}>
                {pc}
              </option>
            ))}
          </select>

          <label className="form-label h4" htmlFor="city">
            Ville
          </label>
          <select
            id="city"
            className="form-control border border-secondary mb-4"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">-- Choisir une ville --</option>
            {cities.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="form-label h4" htmlFor="species">
            Espèce
          </label>
          <select
            id="species"
            className="form-control border border-secondary mb-4"
            value={speciesId}
            onChange={(e) => setSpeciesId(Number(e.target.value))}
          >
            <option value="">-- Choisir une espèce --</option>
            {speciesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            className="btn btn-primary d-block mx-auto px-4 py-2 fs-6"
            type="submit"
            value="Créer l’animal"
            disabled={isSending}
          />
        </div>
      </form>
    </div>
  );
}