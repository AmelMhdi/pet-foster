import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalisationsFromApi } from "../services/userApi";
import { updateAssociation } from "../services/associationsApi";
import { useUserStore } from "../store";
import { ILocalisation, IUserUpdateForm } from "../@types";
import { logError } from "../helpers/logError";
import { userUpdateSchema } from "../validators/users.schemas";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const localisationsData = await getLocalisationsFromApi();
        setLocalisations(localisationsData);
      } catch (error) {
        setFeedback("Erreur lors du chargement des localisations.");
        logError("Erreur lors du chargement des localisations", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (user && localisations.length > 0) {
      setLastname(user.lastname || "");
      setFirstname(user.firstname || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
      setPhone_number(user.phone_number || "");
      setPostcode(user.localisation?.postcode?.toString() || "");
      setCity(user.localisation?.city || "");
    }
  }, [user, localisations]);

  // Create sets of all cities and postcodes
  const allCities = Array.from(new Set(localisations.map((loc) => loc.city)));
  const allPostcodes = Array.from(new Set(localisations.map((loc) => loc.postcode)));

   // Filter cities based on selected postcode (if any)
  const filteredCities = postcode
    ? Array.from(
        new Set(localisations.filter((loc) => loc.postcode.toString() === postcode).map((loc) => loc.city))
      )
    : allCities;

    // Filter postcodes based on selected city (if any)
  const filteredPostcodes = city
    ? Array.from(
        new Set(localisations.filter((loc) => loc.city === city).map((loc) => loc.postcode.toString()))
      )
    : allPostcodes.map((pc) => pc.toString());

  // Handlers for city and postcode selection, reset other field if inconsistent
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPostcode(value);

    // Reset city if current city is not in filtered cities for selected postcode
    if (value && !filteredCities.includes(city)) {
      setCity("");
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCity(value);

    // Reset postcode if current postcode is not in filtered postcodes for selected city
    if (value && !filteredPostcodes.includes(postcode)) {
      setPostcode("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedLocalisation = localisations.find(
      (loc) => loc.city === city && loc.postcode.toString() === postcode
    );

    if (!selectedLocalisation) {
      setFeedback("Localisation invalide.");
      return;
    }

    if (password && password !== confirmPassword) {
      setFeedback("Les mots de passe ne correspondent pas.");
      return;
    }

    const userData: IUserUpdateForm = {
      lastname,
      firstname,
      email,
      address,
      localisation_id: selectedLocalisation.id,
      phone_number,
      role_id: 1,
      ...(password.trim() !== "" ? { password } : {}),
    };

    const { error } = userUpdateSchema.validate(userData, {
      abortEarly: true,
    });

    if (error) {
      setFeedback(error.details[0].message);
      return;
    }

    await handleRegister(userData);
  };

  const handleRegister = async (data: IUserUpdateForm) => {
    if (!user || typeof user.id !== "number") {
      logError("Utilisateur non connecté ou ID invalide", user);
      return;
    }

    const dataWithId: IUserUpdateForm = {
      ...data,
      id: user.id,
      role_id: 1,
    };

    setFeedback("Modification du compte en cours...");
    setIsSending(true);

    try {
      const response = await updateAssociation(dataWithId);

      if ("error" in response) {
        setFeedback(response.error);
        setIsSending(false);
        return;
      }

      // Convert localisation.postcode to string to match IUserT type
      const patchedResponse = {
        ...response,
        localisation: response.localisation
          ? {
              ...response.localisation,
              postcode: response.localisation.postcode?.toString() ?? "",
            }
          : undefined,
      };
      useUserStore.getState().setUser(patchedResponse);
      setFeedback("Modification réussie !");
      setIsSending(false);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setFeedback("Erreur lors de la mise à jour du compte.");
      setIsSending(false);
      logError("Erreur lors de la mise à jour du compte.", error);
    }
  };

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
          <select id="postcode" className="form-control mb-4" value={postcode} onChange={handlePostcodeChange}>
            <option value="">-- Choisir un code postal --</option>
            {filteredPostcodes.map((pc, index) => (
              <option key={index} value={pc}>{pc}</option>
            ))}
          </select>

          <label className="form-label h4" htmlFor="city">
          Ville
          </label>
          <select id="city" className="form-control mb-4" value={city} onChange={handleCityChange}>
            <option value="">-- Choisir une ville --</option>
            {filteredCities.map((c, index) => (
              <option key={index} value={c}>{c}</option>
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