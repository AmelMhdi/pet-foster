import { useEffect, useState } from "react";
import { ILocalisation, IUserUpdateForm } from "../types";
import { useNavigate } from "react-router-dom";

import {getLocalisationsFromApi} from "../services/usersApi";
import { updateAssociation} from "../services/associationsApi";
import { useUserStore } from "../store";

export default function UpdateProfilAssociation() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);


  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");


  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");

 
     //modificaition du compte
        const handleRegister = async (data: IUserUpdateForm) =>{
              
            // Appel de la fonction pour créer l'utilisateur 
            const response = await updateAssociation(data);
            console.log("Réponse API :", response);
    
            if (!response) {
                console.error("La réponse de l'API est null.");
                return;
            }
              
            // TODO mettre un message de feedback 
            alert("Modification réussie !");
    
            navigate("/")
        };
    
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //   Pour que postcode corresponde à ville
   const selectedLocalisation = localisations.find(
  (loc) => loc.city === city && loc.postcode === Number(postcode)
);


    if (!selectedLocalisation) {
      alert("❌ Localisation invalide.");
      return;
    }
 
          const userData: IUserUpdateForm = {
       
          lastname,
          firstname,
          email,
          password,
          address,
          localisation_id: selectedLocalisation.id,
          phone_number,
                   };  
  
          console.log("🔎 Données envoyées :", userData);
          await handleRegister(userData)
  };

  // Charger rôles et localisations
  useEffect(() => {
    const loadData = async () => {
      const localisationsData = await getLocalisationsFromApi();
      setLocalisations(localisationsData);
    };
    loadData();
  }, []);
    
   
    useEffect(() => {
      console.log("🧾 user dans le useEffect :", user);

  
   if (user && localisations.length > 0) {
    setLastname(user.lastname || "");
    setFirstname(user.firstname || "");
    setEmail(user.email || "");
    setAddress(user.address || "");
    setPhone_number(user.phone_number || "");
    setPostcode(user.localisation?.postcode?.toString() || "");
    setCity(user.localisation?.city || "");

    console.log(" Initialisation faite :");
    console.log("Ville :", user.localisation?.city);
    console.log("Code postal :", user.localisation?.postcode?.toString());
  }
}, [user, localisations]);

 const cities = Array.from(new Set(localisations.map((loc) => loc.city)));
        const postcodes = Array.from(new Set(localisations.map((loc) => loc.postcode)));

  return (
    <div className="container mt-5">
      <h1>Modifiez votre compte</h1>

        <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label h4" htmlFor="lastname">
                         "Nom de l'association"
              
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />

          <label className="form-label h4" htmlFor="firstname">
                           "Nom du représentant"
              "Prénom"
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />

          <label className="form-label h4" htmlFor="email">
            Email
          </label>
          <input
            className="form-control mb-4"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="form-label h4" htmlFor="password">
            Mot de passe
          </label>
          <input
            className="form-control mb-4"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="form-label h4" htmlFor="confirm">
            Confirmation du mot de passe
          </label>
          <input
            className="form-control mb-4"
            type="password"
            id="confirm"
            name="confirm"
            placeholder="********"
            autoComplete="new-password"
          />

          <label className="form-label h4" htmlFor="address">
            Adresse
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <label className="form-label h4" htmlFor="phone_number">
            Téléphone
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="phone_number"
            value={phone_number}
            onChange={(e) => setPhone_number(e.target.value)}
            required
          />

          <label className="form-label h4" htmlFor="postcode">
            Code postal
          </label>
          <select
            id="postcode"
            className="form-control mb-4"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
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
            className="form-control mb-4"
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

          <input
            className="btn btn-primary d-block my-4 mx-auto"
            type="submit"
            value="Mettre à jour"
          />
        </div>
      </form>
    </div>
  );
}
