import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store";
import { getLocalisationsFromApi } from "../services/usersApi";
import { api, getAnimal } from "../services/api";
import { IAnimal, ILocalisation, ISpecies } from "../@types";

export default function UpdateAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const user = useUserStore((state) => state.user);

  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [postcode, setPostcode] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [speciesId, setSpeciesId] = useState<number | "">("");

  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [speciesList, setSpeciesList] = useState<ISpecies[]>([]);

  useEffect(() =>{
    const fetchData = async () => {
      if (!id) return;

      try {
        const [locs, species, animal] = await Promise.all([
          getLocalisationsFromApi(),
          api.getSpeciesFromApi(),
          api.getAnimal(Number(id)),
        ]);

        if (!animal) {
          setFeedback("Animal non trouvé.");
          return
        }

        setLocalisations(locs);
        setSpeciesList(species);

        setName(animal.name);
        setBirthday(animal.birthday);
        setDescription(animal.description);
        setPicture(animal.picture);
        setSpeciesId(animal.species_id);

        const localisation = locs.find((loc) => loc.id === animal.localisation_id);
        if (localisation) {
          setPostcode(localisation.postcode);
          setCity(localisation.city);
        }

        nameInputRef.current?.focus();
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setFeedback("Une erreur est survenue lors du chargement des données.");        
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("Utilisateur non authentifié.");
      return;
    }

    const selectedLoc = localisations.find((loc) => loc.city === city && loc.postcode === postcode);

    if (!selectedLoc || !name || !birthday || !description || !picture || !speciesId) {
      setFeedback("Veuillez remplir tous les champs.");
      return;
    }

    const updatedAnimal: IAnimal = {
      id: Number(id),
      name,
      birthday,
      description,
      picture,
      localisation_id: selectedLoc.id,
      species_id: speciesId,
      user_id: user.id,
    };

    setIsSending(true);
    setFeedback("Mise à jour en cours...");

    try {
      const res = await api.updateAnimalFromApi(updatedAnimal, user.token);
      if (res) {
        setFeedback("Animal mis à jour avec succès !");
        setTimeout(() => navigate(`/profil-association/${user.id}`), 1000);
      } else {
        setFeedback("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error(error);
      setFeedback("Une erreur est survenue.");
    } finally {
      setIsSending(false);
    }
  };

  const cities = useMemo(
    () => Array.from(new Set(localisations.map((loc) => loc.city))),
    [localisations]
  );

  const postcodes = useMemo(
    () => Array.from(new Set(localisations.map((loc) => loc.postcode))),
    [localisations]
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Modifier l’animal</h1>

      {feedback && (
        <div className="alert alert-info text-center my-3">{feedback}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="form-label h4" htmlFor="name">Nom</label>
        <input
          ref={nameInputRef}
          className="form-control mb-3"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSending}
        />

        <label className="form-label h4" htmlFor="birthday">Date de naissance</label>
        <input
          className="form-control mb-3"
          id="birthday"
          type="date"
          value={birthday ? birthday.slice(0, 10) : ""}
          onChange={(e) => setBirthday(e.target.value)}
          disabled={isSending}
        />

        <label className="form-label h4" htmlFor="description">Description</label>
        <textarea
          className="form-control mb-3"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSending}
        />

        <label className="form-label h4" htmlFor="picture">Image (URL)</label>
        <input
          className="form-control mb-3"
          id="picture"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
          disabled={isSending}
        />

        <label className="form-label h4" htmlFor="postcode">Code Postal</label>
        <select
          id="postcode"
          className="form-control mb-3"
          value={postcode}
          onChange={(e) =>
            setPostcode(e.target.value === "" ? "" : Number(e.target.value))
          }
          disabled={isSending}
        >
          <option value="">-- Choisir un code postal --</option>
          {postcodes.map((pc, i) => (
            <option key={i} value={pc}>{pc}</option>
          ))}
        </select>

        <label className="form-label h4" htmlFor="city">Ville</label>
        <select 
          id="city" 
          className="form-control mb-3" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
          disabled={isSending}
        >
          <option value="">-- Choisir une ville --</option>
          {cities.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <label className="form-label h4" htmlFor="species">Espèce</label>
        <select
          id="species"
          className="form-control mb-3"
          value={speciesId}
          onChange={(e) => 
            setSpeciesId(e.target.value === "" ? "" : Number(e.target.value))
          }
          disabled={isSending}
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