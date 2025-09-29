import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { createUser, getRolesFromApi } from "../services/userApi";
import { IRole, IUser } from "../@types";
import { userRegisterSchema } from "../validators/users.schemas";

export default function Register() {
  const navigate = useNavigate();
  const lastnameInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [roleId, setRoleId] = useState<number>();

  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [street_number, setStreetNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zip_code, setZipCode] = useState<string>("");
  const [city, setCity] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [rna_number, setRnaNumber] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    lastnameInputRef.current?.focus();
  }, [roleId]);

  useEffect(() => {
    const loadData = async () => {
      const rolesData = await getRolesFromApi();
      setRoles(rolesData);
    };
    loadData();
  }, []);

  const getRoleLabel = (roleName: string) => {
    const labels: Record<string, string> = {
      "Admin": "Administrateur",
      "Association": "Association",
      "FamilleAccueil": "Famille d'accueil",
    };
    return labels[roleName] || roleName;
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
    setIsSending(false);
    setTimeout(() => {
      navigate("/se-connecter");
    }, 1000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setFeedback("");

    if (password !== confirmPassword) {
      setFeedback("Les mots de passe ne correspondent pas.");
      setFieldErrors({ password: "Les mots de passe ne correspondent pas.", confirmPassword: "Les mots de passe ne correspondent pas." });
      return;
    }

    const userData: IUser = {
      last_name,
      first_name,
      email,
      password,
      street_number,
      address,
      zip_code,
      city,
      phone_number,
      role_id: roleId,
      ...(roleId === 1 && rna_number.trim() !== "" && { rna_number }),
    };

    const { error } = userRegisterSchema.validate(userData, {
      abortEarly: true,
    });

    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as string;
        errors[field] = detail.message;
      });
      setFieldErrors(errors);
      setFeedback("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    await handleRegister(userData);
  };

  const selectedRole = roles.find((role) => role.id === roleId);
  const isAssociation = selectedRole?.name === "Association";

  return (
    <div className="container mt-5">
      <div className="card-base card-body-standard fade-in">
        <h1>Créer un compte</h1>
        {feedback && (
          <div 
            className={`alert ${fieldErrors && Object.keys(fieldErrors).length 
              ? 'alert-danger'
              : 'alert-info'
            } text-center my-3`}
            role="alert"
          >
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
                {getRoleLabel(role.name)}
              </label>
            </div>
          ))}
        </fieldset>

        {roleId !== undefined && (
          <form className="fade-in custom-form" method="post" onSubmit={handleSubmit} noValidate>
            <div>
              {/* Nom */}
              <label className="form-label h4" htmlFor="last_name">
                {isAssociation ? "Nom de l'association" : "Nom"}
                <span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.last_name ? 'border-danger' : 'border-secondary'} mb-1`}
                type="text"
                id="last_name"
                name="last_name"
                placeholder={isAssociation ? "Nom de l'organisation" : "Nom de famille"}
                autoComplete="family-name"
                value={last_name}
                ref={lastnameInputRef}
                onChange={(e) => setLastName(e.target.value)}
                aria-invalid={!!fieldErrors.last_name}
                aria-describedby={fieldErrors.last_name ? "last_name-error" : undefined}
                required
              />
              {fieldErrors.last_name && (
                <div id="last_name-error" className="text-danger small mb-3">
                  {fieldErrors.last_name}
                </div>
              )}
              {!fieldErrors.last_name && <div className="mb-3"></div>}

              {/* Prénom */}
              <label className="form-label h4" htmlFor="first_name">
                {isAssociation ? "Prénom du représentant" : "Prénom"}
                <span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.first_name ? 'border-danger' : 'border-secondary'} mb-1`}
                type="text"
                id="first_name"
                name="first_name"
                placeholder={isAssociation ? "Prénom du contact" : "Prénom"}
                autoComplete="given-name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                aria-invalid={!!fieldErrors.first_name}
                aria-describedby={fieldErrors.first_name ? "first_name-error" : undefined}
                required
              />
              {fieldErrors.first_name && (
                <div id="first_name-error" className="text-danger small mb-3">
                  {fieldErrors.first_name}
                </div>
              )}
              {!fieldErrors.first_name && <div className="mb-3"></div>}

              {/* Email */}
              <label className="form-label h4" htmlFor="email">
                  Email<span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.email ? 'border-danger' : 'border-secondary'} mb-1`}
                type="email"
                id="email"
                name="email"
                placeholder="email@domain.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                required
              />
              {fieldErrors.email && (
                <div id="email-error" className="text-danger small mb-3">
                  {fieldErrors.email}
                </div>
              )}
              {!fieldErrors.email && <div className="mb-3"></div>}

              {/* Mot de passe */}
              <label className="form-label h4" htmlFor="password">
                Mot de passe<span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.password ? 'border-danger' : 'border-secondary'} mb-1`}
                type="password"
                id="password"
                name="password"
                placeholder="*********"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                required
              />
              {fieldErrors.password && (
                <div id="password-error" className="text-danger small mb-3">
                  {fieldErrors.password}
                </div>
              )}
              {!fieldErrors.password && <div className="mb-3"></div>}

              {/* Confirmation du mot de passe */}
              <label className="form-label h4" htmlFor="confirm">
                Confirmation du mot de passe<span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.confirmPassword ? 'border-danger' : 'border-secondary'} mb-1`}
                type="password"
                id="confirm"
                name="confirm"
                placeholder="*********"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? "confirm-password" : undefined}
                required
              />
              {fieldErrors.confirmPassword && (
                <div id="confirm-password" className="text-danger small mb-3">
                  {fieldErrors.confirmPassword}
                </div>
              )}
              {!fieldErrors.confirmPassword && <div className="mb-3"></div>}

              {/* Téléphone */}
              <label className="form-label h4" htmlFor="phone_number">
                Téléphone<span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.phone_number ? 'border-danger' : 'border-secondary'} mb-1`}
                type="tel"
                id="phone_number"
                name="phone_number"
                placeholder="0123456789"
                autoComplete="tel"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                aria-invalid={!!fieldErrors.phone_number}
                aria-describedby={fieldErrors.phone_number ? "phone-error" : undefined}
                required
              />
              {fieldErrors.phone_number && (
                <div id="phone-error" className="text-danger small mb-3">
                  {fieldErrors.phone_number}
                </div>
              )}
              {!fieldErrors.phone_number && <div className="mb-3"></div>}


              {/* Numéro de rue */}
              <label className="form-label h4" htmlFor="street_number">
                Numéro de rue<span className="text-danger"> *</span>
              </label>
              <input 
                className={`form-control border ${fieldErrors.street_number ? 'border-danger' : 'border-secondary'} mb-1`}
                type="text" 
                id="street_number"
                name="street_number"
                placeholder="123"
                autoComplete="off"
                value={street_number}
                onChange={(e) => setStreetNumber(e.target.value)}
                aria-invalid={!!fieldErrors.street_number}
                aria-describedby={fieldErrors.street_number ? "street_number-error" : undefined}
                required
              />
              {fieldErrors.street_number && (
                <div id="street_number-error" className="text-danger small mb-3">
                  {fieldErrors.street_number}
                </div>
              )}
              {!fieldErrors.street_number && <div className="mb-3"></div>}

              {/* Adresse */}
              <label className="form-label h4" htmlFor="address">
                Adresse<span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.address ? 'border-danger' : 'border-secondary'} mb-1`}
                type="text"
                id="address"
                name="address"
                placeholder="Nom de la rue"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-invalid={!!fieldErrors.address}
                aria-describedby={fieldErrors.address ? "address-error" : undefined}
                required
              />
              {fieldErrors.address && (
                <div id="address-error" className="text-danger small mb-3">
                  {fieldErrors.address}
                </div>
              )}
              {!fieldErrors.address && <div className="mb-3"></div>}

              {/* Code postal */}
              <label className="form-label h4" htmlFor="postcode">
                Code postal<span className="text-danger"> *</span>
              </label>
              <input
                className={`form-control border ${fieldErrors.zip_code ? 'border-danger' : 'border-secondary'} mb-4`}
                id="zip_code"
                name="zip_code"
                placeholder="75000"
                autoComplete="postal-code"
                value={zip_code}
                onChange={(e) => setZipCode(e.target.value)}
                aria-invalid={!!fieldErrors.zip_code}
                aria-describedby={fieldErrors.zip_code ? "zip_code-error" : undefined}
                required
              />
              {fieldErrors.zip_code && (
                <div id="zip_code-error" className="text-danger small mb-3">
                  {fieldErrors.zip_code}
                </div>
              )}
              {!fieldErrors.zip_code && <div className="mb-3"></div>}
          
              {/* Ville */}
              <label className="form-label h4" htmlFor="city">
                Ville<span className="text-danger"> *</span>
              </label>
              <input 
                className={`form-control border ${fieldErrors.city ? 'border-danger' : 'border-secondary'} mb-4`}
                type="text"
                id="city"
                name="city"
                placeholder="Paris"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-invalid={!!fieldErrors.city}
                aria-describedby={fieldErrors.city ? "city-error" : undefined}
                required
              />
              {fieldErrors.city && (
                <div id="city-error" className="text-danger small mb-3">
                  {fieldErrors.city}
                </div>
              )}
              {!fieldErrors.city && <div className="mb-3"></div>}

              {/* Numéro RNA - uniquement pour les associations */}
              {isAssociation && (
                <>
                  <label className="form-label h4" htmlFor="rna_number">
                    Numéro RNA
                  </label>
                  <input
                    className={`form-control border ${fieldErrors.rna_number ? 'border-danger' : 'border-secondary'} mb-4`}
                    type="text" 
                    id="rna_number"
                    name="rna_number"
                    placeholder="W123456789"
                    autoComplete="organization"
                    value={rna_number}
                    onChange={(e) => setRnaNumber(e.target.value)}
                    aria-invalid={!!fieldErrors.rna_number}
                    aria-describedby={fieldErrors.rna_number ? "rna_number-error" : undefined}
                  />
                  {fieldErrors.rna_number && (
                    <div id="rna_number-error" className="text-danger small mb-3">
                      {fieldErrors.rna_number}
                    </div>
                  )}
                  {!fieldErrors.rna_number && <div className="mb-3"></div>}
                </>
              )}

              {/* Bouton de soumission */}
              <input
                className="btn btn-primary d-block my-4 mx-auto px-5 py-2 fs-6"
                type="submit"
                value={"Créer un compte"}
                disabled={isSending}
              />
            </div>
          </form>
        )}

        <p className="my-4">
          Vous avez déjà un compte ?{" "}
          <a href="/se-connecter" className="custom-login-link form-login-link">
            Connectez-vous ici.
          </a>
        </p>
      </div>
    </div>);
}