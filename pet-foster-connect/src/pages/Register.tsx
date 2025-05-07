
import { useEffect, useState } from "react";

import { useNavigate } from "react-router";


import { createUser, getLocalisationsFromApi, getRolesFromApi } from "../services/usersApi"; 
import { ILocalisation, IRole, IUser } from "../@types/user-index";



export default function Register() {

// utilisavtion du hook useNavigate
     const navigate = useNavigate();
    
        // localisations et role
    const [localisations, setLocalisations] = useState<ILocalisation[]>([]);
    const [city, setCity] = useState<string>("");
    const [postcode, setPostcode] = useState<number | "">("");
  
    const [roles, setRoles] = useState<IRole[]>([]);
    const [roleId, setRoleId] = useState<number>();

    // TODO : factoriser les useState 
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [rma_number, setRma_number] = useState("");
   
    //création du compte
    const handleRegister = async (userData: IUser) =>{
          
        // Appel de la fonction pour créer l'utilisateur 
        const response = await createUser(userData);
        console.log("📥 Réponse API :", response);

        if (!response) {
            console.error("La réponse de l'API est null.");
            return;
        }

        // TODO mettre un message de feedback 
        alert("✅ Inscription réussie !");

        navigate("/se-connecter")
    };
         

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
 
        const selectedLocalisation = localisations.find((loc) => loc.city === city && loc.postcode === postcode
        );

        if (!selectedLocalisation) {
            alert("❌ Localisation invalide.");
            return;
        }
        
        if (roleId === undefined) {
            alert("❌ Vous devez sélectionner un rôle.");
            return;
        }

        // TODO : envoyer un message si tel existe déja, email aussi, sil faut renvoyer , si RNA existe déja
              
        const userData: IUser = {
        lastname,
        firstname,
        email,
        password,
        address,
        localisation_id: selectedLocalisation.id,
        phone_number,
        role_id: roleId,
        ...(roleId === 1 && rma_number.trim() !== "" && { rma_number }) // Ajout conditionnel
        };  

        console.log("🔎 Données envoyées :", userData);
        await handleRegister(userData)
    }

 // Charger les rôles et les localisations
    useEffect(() => {
        const loadData = async () => {
            const rolesData = await getRolesFromApi();
            const localisationsData: ILocalisation[] = await getLocalisationsFromApi();
            setRoles(rolesData);
            setLocalisations(localisationsData);
        };

        loadData();
    }, []);

        // Extraire les villes et les codes postaux distincts
        const cities = Array.from(new Set(localisations.map((loc) => loc.city)));
        const postcodes = Array.from(new Set(localisations.map((loc) => loc.postcode)));
        const selectedRole = roles.find((role) => role.id === roleId);

        return (
            <div className="container mt-5">
                <h1>Créer un compte</h1>

                <fieldset className="mb-4">
                            <legend className="form-label h4">Rôle</legend>
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
                                        required
                                    />
                                    <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                </fieldset>


                <form method="post" onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label h4" htmlFor="lastname">
                        {selectedRole?.name === "association" ? "Nom de l'association" : "Nom"}
                        </label>
                        <input
                            className="form-control border border-secondary mb-4  focus:border-danger"
                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder={selectedRole?.name === "association" 
                            ? "Nom de l'organisation" 
                            : "Nom de famille"}
                            required
                            autoComplete="family-name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                
               
                        <label className="form-label h4" htmlFor="firstname">
                        {selectedRole?.name === "association" ? "Nom du représentant" : "Prénom"}
                        </label>
                        <input
                            className="form-control border border-secondary mb-4"
                            type="text"
                            id="firstname"
                            name="firstname"
                            placeholder={selectedRole?.name === "association" 
                            ? "Nom du contact" 
                            : "Prénom"}
                            required
                            autoComplete="given-name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />

                        <label className="form-label h4" htmlFor="email">Email</label>
                        <input
                            className="form-control border border-secondary mb-4"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email@domain.com"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className="form-label h4" htmlFor="password">Mot de passe</label>
                        <input
                            className="form-control border border-secondary mb-4"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="*********"
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label className="form-label h4" htmlFor="confirm">Confirmation du mot de passe</label>
                        <input
                            className="form-control border border-secondary mb-4"
                            type="password"
                            id="confirm"
                            name="confirm"
                            placeholder="*********"
                            required
                            autoComplete="new-password"
                        />

                        <label className="form-label h4" htmlFor="address">Adresse</label>
                        <input
                            className="form-control border border-secondary mb-4"
                            type="text"
                            id="address"
                            name="address"
                            placeholder="adresse"
                            required
                            autoComplete="street-address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <label className="form-label h4" htmlFor="phone_number">Telephone</label>
                        <input
                            className="form-control border border-secondary mb-4"
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            placeholder="telephone"
                            required
                            autoComplete="tel"
                            value={phone_number}
                            onChange={(e) => setPhone_number(e.target.value)}
                        />
                        {/* A relire */}
                        <label className="form-label h4" htmlFor="postcode">Code Postal</label>
                        <select
                            id="postcode"
                            className="form-control border border-secondary mb-4"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value ? Number(e.target.value) : "")}

                            required
                        >
                            <option value="">-- Choisir un code postal --</option>
                            {postcodes.map((postcode, index) => (
                                <option key={index} value={postcode}>
                                    {postcode}
                                </option>
                            ))}
                        </select>
                    
                        <label className="form-label h4" htmlFor="city">Ville</label>
                        <select
                            id="city"
                            className="form-control border border-secondary mb-4"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        >
                            <option value="">-- Choisir une ville --</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
{/* 
                        <label className="form-label h4" htmlFor="role">Rôle</label>
                        <select
                            className="form-control mb-4"
                            name="role"
                            id="role"
                             value={roleId ?? ""} 
                            onChange={(e) => setRoleId(Number(e.target.value))}
                            required
                        >
                            
                            <option value="">-- Choisir un rôle --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select> */}

                      




                    
                        {selectedRole?.name === "association" && (
                            <>
                                <label className="form-label h4" htmlFor="rma_number">RNA</label>
                                <input
                                    className="form-control mb-4"
                                    type="text"
                                    id="rma_number"
                                    name="rma_number"
                                    placeholder="RNA"
                                    required
                                    autoComplete="organization"
                                    value={rma_number}
                                    onChange={(e) => setRma_number(e.target.value)}
                                />
                            </>
                        )}
                        <input
                            className="btn btn-primary d-block my-4 mx-auto"
                            type="submit"
                            value="S'inscrire"
                        />
                    </div>
                </form>
                <p className="my-1">Vous avez déjà un compte ? <a href="/login">Connectez-vous ici</a></p>
            </div>
       
        );
    }

