import { loginFromApi } from "../services/usersApi";

import { useState } from "react";
import { useNavigate } from "react-router";

import { useUserStore } from "../store";
import { ILoginResponse } from "../types";


/**
 * Fonction qui permet à l'utilisateur de se connecter.
  */
export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = useUserStore((state) => state.login);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
         event.preventDefault();
        try {
            const response: ILoginResponse = await loginFromApi({ email, password });
            console.log('Réponse API :', response);
            
            if (response && response.token) {
                login(response.email, response.token, response.firstname);
                console.log("📥 Réponse API :", response);
                alert("✅ Connexion réussie !");
                navigate("/")
            }
            else {
                console.log("Identifiants invalides");
            }
            }
        catch (error) {
            console.error("❌ Erreur lors de l'appel à l'API :", error);
        }
         
    }

        return (
            <>
                
                <div className="container mt-5">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label className="form-label h4" htmlFor="email">Email</label>
                            <input
                                className="form-control mb-4"
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
                                className="form-control"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="*********"
                                required
                                autoComplete="current-password"
                                 value={password}
                            onChange={(e) => setPassword(e.target.value)}

                            />

                            <input
                                className="btn btn-primary d-block my-4 mx-auto"
                                type="submit"
                                value="Se connecter"
                            />
                        </form>
                            </div>
                 
                    </div>
                      
            </>
        );
        
    }