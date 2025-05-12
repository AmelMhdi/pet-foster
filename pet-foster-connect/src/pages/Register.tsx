import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  createUser,
  getLocalisationsFromApi,
  getRolesFromApi,
} from "../services/usersApi";
import { ILocalisation, IRole, IUser } from "../@types/user-index";

export default function Register() {
  const navigate = useNavigate();
  const lastnameInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [city, setCity] = useState<string>("");
  const [postcode, setPostcode] = useState<number | "">("");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [roleId, setRoleId] = useState<number>();
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [rma_number, setRma_number] = useState("");

  useEffect(() => {
    lastnameInputRef.current?.focus();
  }, [roleId]);

  const handleRegister = async (userData: IUser) => {
    setFeedback("Création du compte en cours...");
    setIsSending(true);
    await new Promise((res) => setTimeout(res, 1000));
    const response = await createUser(userData);

    if ("error" in response) {
      setFeedback(response.error);
      setIsSending(false);
      return;
    }

    setFeedback("Compte créé avec succès !");
    setIsSending(false);
    setTimeout(() => {
      navigate("/se-connecter");
    }, 1000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedLocalisation = localisations.find(
      (loc) => loc.city === city && loc.postcode === postcode
    );

    if (
      !lastname.trim() ||
      !firstname.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !address.trim() ||
      !phone_number.trim() ||
      !city ||
      !postcode ||
      roleId === undefined ||
      (selectedRole?.name === "association" && !rma_number.trim())
    ) {
      setFeedback("Veuillez renseigner tous les champs.");
      return;
    }

    if (!selectedLocalisation) {
      setFeedback("Localisation invalide.");
      return;
    }

    if (roleId === undefined) {
      setFeedback("Vous devez sélectionner un rôle.");
      return;
    }

    if (password !== confirmPassword) {
      setFeedback("Les mots de passe ne correspondent pas.");
      return;
    }

    const userData: IUser = {
      lastname,
      firstname,
      email,
      password,
      address,
      localisation_id: selectedLocalisation.id,
      phone_number,
      role_id: roleId,
      ...(roleId === 1 && rma_number.trim() !== "" && { rma_number }),
    };

    console.log("Données envoyées :", userData);
    await handleRegister(userData);
  };

  useEffect(() => {
    const loadData = async () => {
      const rolesData = await getRolesFromApi();
      const localisationsData: ILocalisation[] =
        await getLocalisationsFromApi();
      setRoles(rolesData);
      setLocalisations(localisationsData);
    };
    loadData();
  }, []);

  const cities = Array.from(new Set(localisations.map((loc) => loc.city)));
  const postcodes = Array.from(
    new Set(localisations.map((loc) => loc.postcode))
  );
  const selectedRole = roles.find((role) => role.id === roleId);

  return (
    <div className="container mt-5">
      <h1>Créer un compte</h1>
      {feedback && (
        <div className="alert alert-info text-center my-3" role="alert">
          {feedback}
        </div>
      )}

      <fieldset className="mb-4">
        <legend className="form-label h4 fw-bold">
          Selectionnez votre statut :
        </legend>
        {roles.map((role) => (
          <div key={role.id} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id={`role-${role.id}`}
              name="role"
              value={role.id}
              checked={roleId === role.id}
              onChange={(e) => setRoleId(Number(e.target.value))}
            />
            <label className="form-check-label" htmlFor={`role-${role.id}`}>
              {role.name}
            </label>
          </div>
        ))}
      </fieldset>

      {roleId !== undefined && (
        <form method="post" onSubmit={handleSubmit}>
          <div>
            <label className="form-label h4" htmlFor="lastname">
              {selectedRole?.name === "association"
                ? "Nom de l'association"
                : "Nom"}
            </label>
            <input
              className="form-control border border-secondary mb-4  focus:border-danger"
              type="text"
              id="lastname"
              name="lastname"
              placeholder={
                selectedRole?.name === "association"
                  ? "Nom de l'organisation"
                  : "Nom de famille"
              }
              autoComplete="family-name"
              value={lastname}
              ref={lastnameInputRef}
              onChange={(e) => setLastname(e.target.value)}
            />

            <label className="form-label h4" htmlFor="firstname">
              {selectedRole?.name === "association"
                ? "Nom du représentant"
                : "Prénom"}
            </label>
            <input
              className="form-control border border-secondary mb-4"
              type="text"
              id="firstname"
              name="firstname"
              placeholder={
                selectedRole?.name === "association"
                  ? "Nom du contact"
                  : "Prénom"
              }
              autoComplete="given-name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />

            <label className="form-label h4" htmlFor="email">
              Email
            </label>
            <input
              className="form-control border border-secondary mb-4"
              type="email"
              id="email"
              name="email"
              placeholder="email@domain.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="form-label h4" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="form-control border border-secondary mb-4"
              type="password"
              id="password"
              name="password"
              placeholder="*********"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="form-label h4" htmlFor="confirm">
              Confirmation du mot de passe
            </label>
            <input
              className="form-control border border-secondary mb-4"
              type="password"
              id="confirm"
              name="confirm"
              placeholder="*********"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label className="form-label h4" htmlFor="address">
              Adresse
            </label>
            <input
              className="form-control border border-secondary mb-4"
              type="text"
              id="address"
              name="address"
              placeholder="adresse"
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label className="form-label h4" htmlFor="phone_number">
              Telephone
            </label>
            <input
              className="form-control border border-secondary mb-4"
              type="text"
              id="phone_number"
              name="phone_number"
              placeholder="telephone"
              autoComplete="tel"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
            />

            <label className="form-label h4" htmlFor="postcode">
              Code Postal
            </label>
            <select
              id="postcode"
              className="form-control border border-secondary mb-4"
              value={postcode}
              onChange={(e) =>
                setPostcode(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">-- Choisir un code postal --</option>
              {postcodes.map((postcode, index) => (
                <option key={index} value={postcode}>
                  {postcode}
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
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {selectedRole?.name === "association" && (
              <>
                <label className="form-label h4" htmlFor="rma_number">
                  RNA
                </label>
                <input
                  className="form-control mb-4"
                  type="text"
                  id="rma_number"
                  name="rma_number"
                  placeholder="RNA"
                  autoComplete="organization"
                  value={rma_number}
                  onChange={(e) => setRma_number(e.target.value)}
                />
              </>
            )}
            <input
              className="btn btn-primary d-block my-4 mx-auto px- py-2 fs-6"
              type="submit"
              value={"Créer un compte"}
              disabled={isSending}
            />
          </div>
        </form>
      )}

      <p className="my-1">
        Vous avez déjà un compte ?{" "}
        <a href="/se-connecter" className="custom-login-link">
          Connectez-vous ici
        </a>
      </p>
    </div>
  );
}
