import { useState } from "react";
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
  
    emailjs
      .sendForm("service_cuh1mmc", "template_dmc0a37", e.target as HTMLFormElement, "B5Wsv4RsJhFs58T-S")
      .then(
        () => {
          setSuccessMessage("Votre message a été envoyé !");
          setErrorMessage("");
          setIsSending(false);
          setName("");
          setEmail("");
          setMessage("");
        },
        () => {
          setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
          setSuccessMessage("");
          setIsSending(false);
        }
      );
  };  

  return (
    <div className="container mt-5">
      <h1 className="text-center">Contact</h1>

      <form className="mt-4" onSubmit={sendEmail}>
        {successMessage && 
          <div className="alert alert-success custom-success">{successMessage}</div>
        }
        {errorMessage && 
          <div className="alert alert-danger">{errorMessage}</div>
        }

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input 
            type="text"
            name="name"
            placeholder="Votre nom"
            className="form-control"
            value={name} 
            id="name" 
            onChange={(event) => setName(event.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email"
            name="email"
            placeholder="Votre email"
            className="form-control" 
            value={email} 
            id="email" 
            onChange={(event) => setEmail(event.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            name="message"
            placeholder="Écrivez votre message ici..."
            className="form-control"
            value={message}
            id="message"
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          className={`btn ${isSending ? "btn-sending" : "btn-primary"}`}
          disabled={isSending}
        >
          {isSending ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}