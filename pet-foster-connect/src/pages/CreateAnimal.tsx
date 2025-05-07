import { useUserStore } from "../store";
import {  useState, useEffect } from 'react';
import { getLocalisationsFromApi } from "../services/usersApi";
import { api } from "../services/api"
import { ILocalisation, INewAnimal, ISpecies } from "../@types/user-index";

export default function CreateAnimal() {

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

  // Charger localisations + espèces
  useEffect(() => {
    const fetchData = async () => {
      const locs = await getLocalisationsFromApi();
      const species = await api.getSpeciesFromApi();
      setLocalisations(locs);
      setSpeciesList(species);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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

    await fetch("http://localhost:3001/api/animals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(newAnimal),
    });

    alert("✅ Animal créé !");
  };

  const cities = Array.from(new Set(localisations.map((loc) => loc.city)));
  const postcodes = Array.from(new Set(localisations.map((loc) => loc.postcode)));

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <h1>Ajouter un animal</h1>

      <label>Nom</label>
      <input className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Date de naissance</label>
      <input type="date" className="form-control mb-3" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />

      <label>Description</label>
      <textarea className="form-control mb-3" value={description} onChange={(e) => setDescription(e.target.value)} required />

      <label>Image (URL ou nom de fichier)</label>
      <input className="form-control mb-3" value={picture} onChange={(e) => setPicture(e.target.value)} required />

      <label>Code Postal</label>
      <select className="form-control mb-3" value={postcode} onChange={(e) => setPostcode(Number(e.target.value))} required>
        <option value="">-- Sélectionner un code postal --</option>
        {postcodes.map((pc, i) => (
          <option key={i} value={pc}>{pc}</option>
        ))}
      </select>

      <label>Ville</label>
      <select className="form-control mb-3" value={city} onChange={(e) => setCity(e.target.value)} required>
        <option value="">-- Sélectionner une ville --</option>
        {cities.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>

      <label>Espèce</label>
      <select className="form-control mb-4" value={speciesId} onChange={(e) => setSpeciesId(Number(e.target.value))} required>
        <option value="">-- Sélectionner une espèce --</option>
        {speciesList.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <button type="submit" className="btn btn-success">Créer l’animal</button>
    </form>
  );
}