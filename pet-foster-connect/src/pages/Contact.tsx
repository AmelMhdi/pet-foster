import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // mettre à jour les champs du formulaire
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [id]: value
    }));
  };
  
  // gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // test pour afficher les données du formulaire (à enlever dans la version finale)
    console.log("Données du formulaire:", form);

    // réinitialiser le formulaire après soumission
    setForm({
      name: "",
      email: "",
      message: ""
    });

    // message de confirmation
    alert("Votre message a été envoyé !");
  };
  
  return (
    <div className="container mt-5">
      <h1 className="text-center">Contact</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input 
            type="text"
            className="form-control" 
            value={form.name}
            id="name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={form.email}
            id="email"
            onChange={handleChange}
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Écrivez votre message ici..."
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  );
}