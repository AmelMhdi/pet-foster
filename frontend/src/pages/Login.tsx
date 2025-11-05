import { loginFromApi } from "../services/userApi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../store";

export default function Login() {
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = useUserStore((state) => state.login);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setFeedback("Connexion au compte en cours...");
    setIsSending(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simule délai API
      const response = await loginFromApi({ email, password });
      login(response);
      setFeedback("Connexion réussie !");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Une erreur est survenue.");
      setIsSending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setFeedback("Veuillez remplir tous les champs.");
      return;
    }
    await handleLogin(email, password);
  };

  return (
    <div className="container mt-5">
      <h1 className="login-title">Se connecter</h1>
      {feedback && (
        <div className="alert alert-info text-center my-3" role="alert" aria-live="polite">
          {feedback}
        </div>
      )}
      <form className="custom-form" method="post" onSubmit={handleSubmit}>
        <label className="form-label h4" htmlFor="email">
          Email
        </label>
        <input
          className="form-control mb-4"
          type="email"
          id="email"
          name="email"
          placeholder="email@domain.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailInputRef}
          disabled={isSending}
        />

        <label className="form-label h4" htmlFor="password">
          Mot de passe
        </label>
        <input
          className="form-control mb-4"
          type="password"
          id="password"
          name="password"
          placeholder="*********"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSending}
        />

        <input
          className="btn btn-primary d-block my-4 mx-auto px-5 py-2"
          type="submit"
          value={isSending ? "Connexion..." : "Se connecter"}
          disabled={isSending}
        />
      </form>
    </div>
  );
}