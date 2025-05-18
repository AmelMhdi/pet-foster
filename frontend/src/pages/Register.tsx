import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { createUser, getLocalisationsFromApi, getRolesFromApi } from "../services/usersApi";
import { ILocalisation, InputProps, IRole, IUser, SelectProps } from "../@types";
import { userRegisterSchema } from "../validators/users.schemas";

export default function Register() {
  const navigate = useNavigate();
  const lastnameInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [roleId, setRoleId] = useState<number>();
  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone_number: "",
    rma_number: "",
    postcode: "",
    city: "",
  });

  const selectedRole = roles.find((r) => r.id === roleId);
  const cities = Array.from(new Set(localisations.map((loc) => loc.city)));
  const postcodes = Array.from(new Set(localisations.map((loc) => loc.postcode)));

  useEffect(() => {
    const fetchInitialData = async () => {
      const [rolesData, localisationsData] = await Promise.all([
        getRolesFromApi(),
        getLocalisationsFromApi(),
      ]);
      setRoles(rolesData);
      setLocalisations(localisationsData);
    }
    fetchInitialData();
  }, [roleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    setTimeout(() => navigate("/se-connecter"), 1000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedLocalisation = localisations.find(
      (loc) => loc.city === form.city && String(loc.postcode) === form.postcode
    );

    if (!selectedLocalisation) {
      return setFeedback("Localisation invalide");
    }

    if (form.password !== form.confirmPassword) {
      return setFeedback("Les mots de passe ne correspondent pas");
    }

    const userData: IUser = {
      lastname: form.lastname,
      firstname: form.firstname,
      email: form.email,
      password: form.password,
      address: form.address,
      phone_number: form.phone_number,
      localisation_id: selectedLocalisation.id,
      role_id: roleId,
      ...(roleId === 1 && form.rma_number.trim() !== "" && { 
        rma_number: form.rma_number 
      }),
    };

    const { error } = userRegisterSchema.validate(userData, { abortEarly: true });

    if (error) {
      return setFeedback(error.details[0].message);
    }

    await handleRegister(userData);
    setIsSending(false);
  };

  return (
    <div className="container mt-5">
      <div className="card-base card-body-standard fade-in">
        <h1>Créer un compte</h1>

        {feedback && (
          <div className="alert alert-info text-center my-3" role="alert">
            {feedback}
          </div>
        )}

        <fieldset className="mb-4">
          <legend className="form-label h4 fw-bold my-2">Sélectionnez votre statut</legend>
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
          <form className="fade-in custom-form" onSubmit={handleSubmit}>
            <Input label={selectedRole?.name === "association" ? "Nom de l'association" : "Nom"} name="lastname" value={form.lastname} onChange={handleChange} ref={lastnameInputRef} />
            <Input label={selectedRole?.name === "association" ? "Nom du représentant" : "Prénom"} name="firstname" value={form.firstname} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} />
            <Input label="Confirmation du mot de passe" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
            <Input label="Adresse" name="address" value={form.address} onChange={handleChange} />
            <Input label="Téléphone" name="phone_number" value={form.phone_number} onChange={handleChange} />

            <Select label="Code postal" name="postcode" value={form.postcode} options={postcodes} onChange={handleChange} />
            <Select label="Ville" name="city" value={form.city} options={cities} onChange={handleChange} />

            {selectedRole?.name === "association" && (
              <Input label="RNA" name="rma_number" value={form.rma_number} onChange={handleChange} />
            )}

            <input className="btn btn-primary d-block my-4 mx-auto px- py-2 fs-6" type="submit" value="Créer un compte" disabled={isSending} />
          </form>
        )}

        <p className="my-4">
          Vous avez déjà un compte ?{" "}
          <a href="/se-connecter" className="custom-login-link form-login-link">
            Connectez-vous ici
          </a>
        </p>
      </div>
    </div>
  );
}

import React from "react";

const Input = React.forwardRef<HTMLInputElement, Omit<InputProps, "ref">>(
  ({ label, name, value, onChange, type = "text" }, ref) => (
    <>
      <label className="form-label h4" htmlFor={name}>{label}</label>
      <input
        ref={ref}
        className="form-control border border-secondary mb-4"
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={name}
      />
    </>
  )
);
Input.displayName = "Input";

function Select({ label, name, value, options, onChange }: SelectProps) {
  return (
    <>
      <label className="form-label h4" htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        className="form-control border border-secondary mb-4"
        value={value}
        onChange={onChange}
      >
        <option value="">-- Choisir {label.toLowerCase()} --</option>
        {options.map((option: string | number, index: number) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </>
  );
}