import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { createUser, getLocalisationsFromApi, getRolesFromApi } from "../services/usersApi";
import { ILocalisation, IRole, IUser } from "../@types";
import { userRegisterSchema } from "../validators/users.schemas";

export default function Register() {
  const navigate = useNavigate();
  const lastnameInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const [roles, setRoles] = useState<IRole[]>([]);
  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);

  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone_number: "",
    rma_number: "",
    roleId: undefined as number | undefined,
    city: "",
    postcode: "" as number | "",
  });

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "postcode" ? (value ? Number(value) : "") : value,
    }));
    setFeedback("");
  };

  const selectedRole = roles.find((r) => r.id === form.roleId);
  const cities = [...new Set(localisations.map((l) => l.city))];
  const postcodes = [...new Set(localisations.map((l) => l.postcode))];

  useEffect(() => {
    lastnameInputRef.current?.focus();
  }, [form.roleId]);

  useEffect(() => {
      (async () => {
        const rolesData = await getRolesFromApi();
        const localisationsData = await getLocalisationsFromApi();
        setRoles(rolesData);
        setLocalisations(localisationsData);
      })();
    }, []);

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
    setTimeout(() => navigate("/se-connecter"), 1000);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setFeedback("Les mots de passe ne correspondent pas.");
      return;
    }

    const selectedLoc = localisations.find(
      (loc) => loc.city === form.city && loc.postcode === form.postcode
    );

    if (!selectedLoc) {
      setFeedback("Localisation invalide.");
      return;
    }

    const userData: IUser = {
      lastname: form.lastname,
      firstname: form.firstname,
      email: form.email,
      password: form.password,
      address: form.address,
      localisation_id: selectedLoc.id,
      phone_number: form.phone_number,
      role_id: form.roleId!,
      ...(form.roleId === 1 && form.rma_number.trim() !== "" && { rma_number: form.rma_number }),
    };

    const { error } = userRegisterSchema.validate(userData, { abortEarly: true });

    if (error) {
      setFeedback(error.details[0].message);
      return;
    }

    await handleRegister(userData);
  };

  return (
    <div className="container mt-5">
      <div className="card-base card-body-standard fade-in">
        <h1>Créer un compte</h1>

        {feedback && <div className="alert alert-info text-center my-3">{feedback}</div>}

        <fieldset className="mb-4">
          <legend className="form-label h4 fw-bold my-2">Sélectionnez votre statut</legend>
          {roles.map((role) => (
            <div key={role.id} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id={`role-${role.id}`}
                name="roleId"
                value={role.id}
                checked={form.roleId === role.id}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={`role-${role.id}`}>
                {role.name}
              </label>
            </div>
          ))}
        </fieldset>

        {form.roleId !== undefined && (
          <form className="fade-in custom-form" onSubmit={handleSubmit}>
            <label className="form-label h4" htmlFor="lastname">
              {selectedRole?.name === "association" ? "Nom de l'association" : "Nom"}
            </label>
            <input
              ref={lastnameInputRef}
              id="lastname"
              name="lastname"
              className="form-control border border-secondary mb-4"
              placeholder={selectedRole?.name === "association" ? "Nom de l'organisation" : "Nom de famille"}
              value={form.lastname}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="firstname">Prénom</label>
            <input
              id="firstname"
              name="firstname"
              className="form-control border border-secondary mb-4"
              value={form.firstname}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control border border-secondary mb-4"
              value={form.email}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control border border-secondary mb-4"
              value={form.password}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="confirmPassword">Confirmation</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-control border border-secondary mb-4"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="address">Adresse</label>
            <input
              id="address"
              name="address"
              className="form-control border border-secondary mb-4"
              value={form.address}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="phone_number">Téléphone</label>
            <input
              id="phone_number"
              name="phone_number"
              className="form-control border border-secondary mb-4"
              value={form.phone_number}
              onChange={handleChange}
            />

            <label className="form-label h4" htmlFor="postcode">Code Postal</label>
            <select
              id="postcode"
              name="postcode"
              className="form-control border border-secondary mb-4"
              value={form.postcode}
              onChange={handleChange}
            >
              <option value="">-- Choisir un code postal --</option>
              {postcodes.map((pc) => (
                <option key={pc} value={pc}>{pc}</option>
              ))}
            </select>

            <label className="form-label h4" htmlFor="city">Ville</label>
            <select
              id="city"
              name="city"
              className="form-control border border-secondary mb-4"
              value={form.city}
              onChange={handleChange}
            >
              <option value="">-- Choisir une ville --</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {selectedRole?.name === "association" && (
              <>
                <label className="form-label h4" htmlFor="rma_number">RNA</label>
                <input
                  id="rma_number"
                  name="rma_number"
                  className="form-control mb-4"
                  value={form.rma_number}
                  onChange={handleChange}
                />
              </>
            )}

            <input
              type="submit"
              value="Créer un compte"
              className="btn btn-primary d-block my-4 mx-auto px- py-2 fs-6"
              disabled={isSending}
            />
          </form>
        )}

        <p className="my-4">
          Vous avez déjà un compte ?{" "}
          <a href="/se-connecter" className="custom-login-link form-login-link">Connectez-vous ici</a>
        </p>
      </div>
    </div>
  );
}
