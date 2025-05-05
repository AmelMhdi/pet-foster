import { loginFromApi } from "../services/usersApi";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../store";
import { ILoginResponse, IUserT } from "../@types/user-index";


export default function Login() {
  // hook qui permet de naviguer par programmation et de rediriger vers une autre page
  const navigate = useNavigate();

  // on définit l'état des champs du formulaire
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // On récupère ici la fonction login depuis le store pour s'en servir après l'appel API. Connexion avec Zustand.
  const login = useUserStore((state) => state.login);

  // Soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const response: ILoginResponse = await loginFromApi({ email, password });
      console.log('Réponse API :', response);
      // Si la réponse est OK, on connecte l'utilisateur dans le store
      if (response?.token ) {
        const user: IUserT = {
          email,
          token: response.token,
          firstname: response.firstname,
          id: response.id, 
          role: response.role
      };
        login(user);
        console.log("Réponse API :", response);
        alert("Connexion réussie !");
        navigate("/")
      } else {
        console.log("Identifiants invalides");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
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