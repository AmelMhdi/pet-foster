import { loginFromApi } from "../services/usersApi";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../store";
import { ILoginResponse } from "../@types/user-index";

export default function Login() {
  // hook qui permet de naviguer par programmation et de rediriger vers une autre page
  const navigate = useNavigate();

  //Gestion de l'inputRef, du feedback et loading pour l'expérience utilisateur
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  // on définit l'état des champs du formulaire
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // On récupère ici la fonction login depuis le store pour s'en servir après l'appel API. Connexion avec Zustand.
  const login = useUserStore((state) => state.login);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // connection au compte
  const handleRegister = async (email: string, password: string) => {
    setFeedback("Connexion au compte en cours...");
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response: ILoginResponse = await loginFromApi({ email, password });

    if ("error" in response) {
      setFeedback(response.error);
      setIsSending(false);
      return;
    }

    // if (response?.token) {
    // const user: IUserT = {
    //   email,
    //   token: response.token,
    //   firstname: response.firstname,
    //   id: response.id,
    //   role: response.role,
    // };

    login(response);
    setFeedback("Connexion réussie !");
    setTimeout(() => {
      navigate("/");
    }, 1000);
    // } else {
    //   setFeedback(" Identifiants invalides.");
    // }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setFeedback("⚠️ Veuillez remplir tous les champs.");
      return;
    }
    await handleRegister(email, password);
  };

  return (
    <>
      <div className="container mt-5">
        <h1>Veuillez vous authentifier </h1>
        {feedback && (
          <div className="alert alert-info text-center my-3" role="alert">
            {feedback}
          </div>
        )}
        <div>
          <form method="post" onSubmit={handleSubmit}>
            <label className="form-label h4" htmlFor="email">
              Email
            </label>
            <input
              className="form-control mb-4"
              type="email"
              id="email"
              name="email"
              placeholder="email@domain.com"
              // required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="form-label h4" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              placeholder="*********"
              // required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="btn btn-primary d-block my-4 mx-auto"
              type="submit"
              value="Se connecter"
              disabled={isSending}
            />
          </form>
        </div>
      </div>
    </>
  );
}
