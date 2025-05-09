import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalisationsFromApi } from "../services/usersApi";
import { updateAssociation } from "../services/associationsApi";
import { useUserStore } from "../store";
import { ILocalisation, IUserUpdateForm } from "../@types/user-index";

export default function UpdateProfilAssociation() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const lastnameInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");

  useEffect(() => {
    lastnameInputRef.current?.focus();
  }, []);

  //modification du compte
  const handleRegister = async (data: IUserUpdateForm) => {
    if (!user || typeof user.id !== "number") {
      console.error("Utilisateur non connecté ou ID invalide");
      return;
    }
    //on copie les informations de user et l'id de user connecté en localstorage pour avoir l'url
    const dataWithId: IUserUpdateForm = {
      ...data,
      id: user?.id,
      role_id: 1,
    };

    // Appel de la fonction pour créer l'utilisateur
    setFeedback("Modification du compte en cours...");
    setIsSending(true);
    const response = await updateAssociation(dataWithId);
    // console.log("Réponse API :", response);

    // if (!response) {
    //   console.error("La réponse de l'API est null.");
    //   return;
    // }

    // Je vais avoir besoin de ça pour remonter l'erreur tout à l'heure
    if ("error" in response) {
      setFeedback(response.error);
      setIsSending(false);
      return;
    }

    setFeedback("Modification réussie !");
    setIsSending(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Vérification des champs obligatoires
    if (
      !lastname.trim() ||
      !firstname.trim() ||
      !email.trim() ||
      !address.trim() ||
      !phone_number.trim() ||
      !postcode.trim() ||
      !city.trim()
    ) {
      setFeedback("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    //   Pour que postcode corresponde à ville
    const selectedLocalisation = localisations.find(
      (loc) => loc.city === city && loc.postcode === Number(postcode)
    );

    if (!selectedLocalisation) {
      setFeedback("Localisation invalide.");
      return;
    }
    // Si l’utilisateur saisit un mot de passe, alors il doit le confirmer correctement. Mais s’il ne touche pas au mot de passe, on ne vérifie rien
    if (password && password !== confirmPassword) {
      setFeedback("Les mots de passe ne correspondent pas.");
      return;
    }

    //  construction du user
    const userData: IUserUpdateForm = {
      lastname,
      firstname,
      email,
      address,
      localisation_id: selectedLocalisation.id,
      phone_number,
      role_id: 1,
      ...(password && password.trim() !== "" ? { password } : {}),
    };

    console.log("Données envoyées :", userData);
    await handleRegister(userData);
  };

  // Localisations possibles
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
  const postcodes = Array.from(
    new Set(localisations.map((loc) => loc.postcode))
  );

  return (
    <div className="container mt-5">
      <h1>Modifiez votre compte</h1>
      {feedback && (
        <div className="alert alert-info text-center my-3" role="alert">
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label h4" htmlFor="lastname">
            Nom de l'association
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="lastname"
            value={lastname}
            ref={lastnameInputRef}
            onChange={(e) => setLastname(e.target.value)}
          />

          <label className="form-label h4" htmlFor="firstname">
            Nom du représentant
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
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
            // placeholder="********"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          />

          <label className="form-label h4" htmlFor="postcode">
            Code postal
          </label>
          <select
            id="postcode"
            className="form-control mb-4"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
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
            value={"Mettre à jour"}
            disabled={isSending}
          />
        </div>
      </form>
    </div>
  );
}
