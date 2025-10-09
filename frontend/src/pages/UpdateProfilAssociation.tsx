import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { IUserUpdateForm } from "../@types";
import { logError } from "../helpers/logError";
import { userUpdateSchema } from "../validators/users.schemas";
import { updateUserFromApi } from "../services/userApi";

export default function UpdateProfilAssociation() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const lastNameInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [street_number, setStreetNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  useEffect(() => {
    lastNameInputRef.current?.focus();
  }, []);


  // Handlers for city and zip code selection, reset other field if inconsistent
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setZipCode(value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCity(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password && password !== confirmPassword) {
      setFeedback("Les mots de passe ne correspondent pas.");
      return;
    }

    const userData: IUserUpdateForm = {
      last_name,
      first_name,
      email,
      street_number,
      address,
      zip_code,
      city,
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
      logError("Utilisateur non connecté ou ID invalide.", user);
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
      const response = await updateUserFromApi(dataWithId);

      if ("error" in response) {
        setFeedback(response.error);
        setIsSending(false);
        return;
      }

      useUserStore.getState().setUser(response);
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
            value={last_name}
            ref={lastNameInputRef}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label className="form-label h4" htmlFor="firstname">
            Nom du représentant
          </label>
          <input
            className="form-control mb-4"
            type="text"
            id="firstname"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
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
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <label className="form-label h4" htmlFor="postcode">
          Code postal
          </label>
          <select id="postcode" className="form-control mb-4" value={zip_code} onChange={handleZipCodeChange}>
          </select>

          <label className="form-label h4" htmlFor="city">
          Ville
          </label>
          <select id="city" className="form-control mb-4" value={city} onChange={handleCityChange}>

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