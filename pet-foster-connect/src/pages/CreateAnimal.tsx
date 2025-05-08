import { useUserStore } from "../store";
import { useNavigate } from "react-router";
import {  useState, useEffect } from 'react';
import { getLocalisationsFromApi } from "../services/usersApi";
import { api, createAnimalFromApi } from "../services/api"
import { ILocalisation, INewAnimal, ISpecies } from "../@types/user-index";

export default function CreateAnimal() {
  const navigate = useNavigate();
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


  //création de l'animal
  const handleRegister = async (animalData: INewAnimal) => {
    const response = await createAnimalFromApi(animalData);
    console.log("Réponse API :", response);

    if (!response) {
      console.error("La réponse de l'API est null.");
      return;
    }
    // TODO mettre un message de feedback 
    alert("creation de l'animal réussie !");
    navigate(`/profil-association/${user.id}`)
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

     if (!user) {
        alert("Utilisateur non authentifié.");
        return;
    }

      const selectedLocalisation = localisations.find(
      (loc) => loc.city === city && loc.postcode === postcode
    );

    if (!selectedLocalisation || !speciesId) {
      alert("Merci de compléter tous les champs correctement.");
      return;
    }

    const newAnimal: INewAnimal = {
      name,
      birthday,
      description,
      picture,
      localisation_id: selectedLocalisation.id,
      species_id: speciesId,
      user_id: user.id,
    };

    console.log("📦 Données envoyées :", newAnimal); 
    await handleRegister(newAnimal)   
  };

  // Charger localisations + espèces
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

  <form method="post" onSubmit={handleSubmit}>
    <div>
      <label className="form-label h4" htmlFor="name">Nom</label>
      <input
        className="form-control border border-secondary mb-4"
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="form-label h4" htmlFor="birthday">Date de naissance</label>
      <input
        className="form-control border border-secondary mb-4"
        type="date"
        id="birthday"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        required
      />

      <label className="form-label h4" htmlFor="description">Description</label>
      <textarea
        className="form-control border border-secondary mb-4"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label className="form-label h4" htmlFor="picture">Image (URL)</label>
      <input
        className="form-control border border-secondary mb-4"
        type="text"
        id="picture"
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
        required
      />

      <label className="form-label h4" htmlFor="postcode">Code Postal</label>
      <select
        id="postcode"
        className="form-control border border-secondary mb-4"
        value={postcode}
        onChange={(e) => setPostcode(Number(e.target.value))}
        required
      >
        <option value="">-- Choisir un code postal --</option>
        {postcodes.map((pc, index) => (
          <option key={index} value={pc}>
            {pc}
          </option>
        ))}
      </select>

      <label className="form-label h4" htmlFor="city">Ville</label>
      <select
        id="city"
        className="form-control border border-secondary mb-4"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      >
        <option value="">-- Choisir une ville --</option>
        {cities.map((c, index) => (
          <option key={index} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="form-label h4" htmlFor="species">Espèce</label>
      <select
        id="species"
        className="form-control border border-secondary mb-4"
        value={speciesId}
        onChange={(e) => setSpeciesId(Number(e.target.value))}
        required
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
      />
    </div>
  </form>
</div>

  );
}